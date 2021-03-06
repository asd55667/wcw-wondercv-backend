const Router = require("koa-router");
const Redis = require("ioredis");
const koaJwt = require("koa-jwt");

const _axios = require("../axios");
// jwt
const jwt = require("jsonwebtoken");

// configs
const {
  smtp,
  transporter,
  genEmailOpts,
  genPdfOpts,
  secret,
  expires,
} = require("../app.config");

const { auth } = require("../../middleware");

const router = new Router({ prefix: "/email" });
const redis = new Redis();

router.post("/code", auth, async (ctx) => {
  const { email } = ctx.request.body;
  const expireDate = await redis.hget(`nodemail:${email}`, "expire");
  console.log(`login email ${email}`, expireDate);
  if (expireDate && expireDate - new Date().getTime() > 180 * 1000) {
    ctx.body = { code: -1, msg: `发送过于频繁，请稍后再试` };
    return;
  }

  const code = smtp.code();
  const mail = genEmailOpts(email, code);

  console.log("val code", code);

  // redis.hmset(`nodemail:${email}`, "code", code, "expire", smtp.expire());
  await transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log(err, "\n发送邮件失败");
      ctx.body = {
        code: -1,
        msg: err,
      };
    } else {
      redis.hmset(`nodemail:${email}`, "code", code, "expire", smtp.expire());
    }
  });

  ctx.status = 200;
  ctx.body = {
    code: 0,
    msg: "验证码已发送，请注意查收，可能会有延时，有效期5分钟",
  };
});

router.post("/", auth, async (ctx) => {
  const { email, valCode } = ctx.request.body;
  const expireDate = await redis.hget(`nodemail:${email}`, "expire");
  const _code = await redis.hget(`nodemail:${email}`, "code");

  // console.log(email, valCode, _code);
  if (valCode !== _code) {
    ctx.body = {
      code: -1,
      msg: "验证码错误",
    };
  } else {
    if (expireDate && new Date().getTime() - expireDate > 0) {
      ctx.body = { code: -1, msg: "验证码已过期" };
    } else {
      const usr = await _axios.post("/v1/users/find", { email });
      const { name, key, role, avatar_url } = usr.data;

      delete usr;
      // console.log(ctx.header["cookie"], ctx.header["wcw-key"]);
      // ctx.res.setHeader("Set-Cookie", `uid=${key};`);
      // ctx.cookies.set("uid", key, {
      //   domain: "localhost",
      //   path: "/index",
      //   maxAge: 180 * 24 * 3600,
      //   expires: new Date("2021-08-15"),
      //   httpOnly: false,
      //   // Secure: true,
      //   overwrite: false  ,
      // });
      const access_token = jwt.sign(
        {
          email,
          id: key,
        },
        secret[0],
        { expiresIn: expires.access_token }
      );
      const refresh_token = jwt.sign(
        {
          email,
          id: key,
          role: role,
        },
        secret[1],
        { expiresIn: expires.refresh_token }
      );
      ctx.body = {
        code: 0,
        access_token,
        refresh_token,
        uid: key,
        user_info: { name, email, avatar_url },
      };
      return;
    }
  }
});

const fs = require("fs");

function getArrayBuffer(data) {
  let len = data.length;
  let ab = new ArrayBuffer(len);
  let u8 = new Uint8Array(ab);
  while (len--) u8[len] = data.charCodeAt(len);
  return ab;
}

router.post("/resume", koaJwt({ secret: secret }), async (ctx) => {
  const { cv, email, filename } = ctx.request.body;

  fs.appendFileSync("wcw.pdf", Buffer.from(getArrayBuffer(cv)));

  const mime = genPdfOpts(email, filename, Buffer.from(getArrayBuffer(cv)));
  try {
    await transporter.sendMail(mime, (err, info) => {
      if (err) {
        console.log(err, "\n发送邮件失败");
        ctx.body = {
          code: -1,
          msg: err,
        };
      } else {
        console.log("success");
        ctx.status = 200;
        ctx.body = {
          code: 0,
          msg: "简历已至邮箱，请注意查收",
        };
      }
    });
  } catch (err) {
    ctx.status = 500;
    console.log(err);
    return;
  }
});

module.exports = router;
