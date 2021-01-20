const Router = require("koa-router");

// jwt
const jwt = require("jsonwebtoken");
const koaJwt = require("koa-jwt");

// configs
const { secret, expires } = require("./config");
const { auth } = require("../../middleware");
const _axios = require("../axios");
const router = new Router({ prefix: "/login" });

const email = require("./email");
const github = require("./github");
router.use(email.routes());
router.use(github.routes());

router.get("/token/refresh", koaJwt({ secret: secret }), async (ctx) => {
  const parts = ctx.header.authorization.trim().split(" ");
  // console.log(ctx.state.verify);
  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      const payload = jwt.verify(token, secret[1], ctx.state.verify);
      delete payload.iat;
      delete payload.exp;
      // delete payload.nbf;
      // delete payload.jti;
      const access_token = jwt.sign(payload, secret[0], {
        expiresIn: expires.access_token,
      });
      console.log("refresh", access_token);
      ctx.body = {
        code: 0,
        access_token,
      };
      return;
    }
  }
  ctx.status = 401;
});

router.get("/token", auth, koaJwt({ secret: secret }), async (ctx) => {
  // if (ctx.state.user.data) console.log(ctx.state.user.data);
  const parts = ctx.header.authorization.trim().split(" ");
  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      const payload = jwt.verify(token, secret[0]);
      // console.log("payload", payload.email);
      try {
        const usr = await _axios.post("/v1/users/find", {
          email: payload.email,
          name: payload.name,
        });
        // console.log(usr.data);
        ctx.body = { user_info: usr.data };
      } catch (err) {
        console.log(err);
      }
    }
  }
});

// test
router.get("/auth", koaJwt({ secret: secret }), async (ctx) => {
  console.log("verify", ctx.state);
  ctx.body = "verify";
});

module.exports = router;
