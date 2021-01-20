const Router = require("koa-router");
const Redis = require("ioredis");

const _axios = require("../axios");
// jwt
const jwt = require("jsonwebtoken");

// configs
const {
  smtp,
  transporter,
  genEmailOpts,
  secret,
  expires,
} = require("./config");

const { auth } = require("../../middleware");

const router = new Router({ prefix: "/email" });
const redis = new Redis();

router.post("/code", auth, async (ctx) => {
  const { email } = ctx.request.body;
  const expireDate = await redis.hget(`nodemail:${email}`, "expire");

  if (expireDate && expireDate - new Date().getTime() > 180 * 1000) {
    ctx.body = { code: -1, msg: `发送过于频繁，请稍后再试` };
    return;
  }

  const code = smtp.code();
  const mailOptions = genEmailOpts(email, code);

  console.log("val code", code);
  // TODO refresh qq email auth code
  // redis.hmset(`nodemail:${email}`, "code", code, "expire", smtp.expire());
  await transporter.sendMail(mailOptions, (err, info) => {
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

      // console.log(ctx.header["cookie"], ctx.header["wcw-key"]);
      // ctx.res.setHeader("Set-Cookie", `sid=112; HttpOnly; `);
      // ctx.cookies.set("cid", "hello world", {
      //   // domain: "localhost",
      //   // path: "/index",
      //   maxAge: 10 * 60 * 1000,
      //   // expires: new Date("2021-02-15"),
      //   httpOnly: true,
      //   Secure: true,
      //   overwrite: true,
      // });
    } else {
      // let usr;
      // try {
      //   usr = await _axios.post("/v1/users/find", { email });
      // } catch (err) {
      //   console.log(err);
      // }

      const usr = await _axios.post("/v1/users/find", { email });
      const { name, key, role, avatar_url } = usr.data;
      console.log(usr.data);

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
        user_info: { name, email, avatar_url },
      };
      return;
    }
  }
});

module.exports = router;
