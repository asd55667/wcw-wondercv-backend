const Router = require("koa-router");

// jwt
const jwt = require("jsonwebtoken");
const koaJwt = require("koa-jwt");

// configs
const { secret, expires } = require("../app.config");
const { auth } = require("../../middleware");
const _axios = require("../axios");
const router = new Router({ prefix: "/login" });

const email = require("./email");
const github = require("./github");
router.use(email.routes());
router.use(github.routes());

router.get("/token/refresh", koaJwt({ secret: secret }), async (ctx) => {
  try {
    const payload = ctx.state.user;
    delete payload.iat;
    delete payload.exp;
    // delete payload.nbf;
    // delete payload.jti;ƒ
    const access_token = jwt.sign(payload, secret[0], {
      expiresIn: expires.access_token,
    });
    ctx.body = {
      code: 0,
      access_token,
    };
  } catch (err) {
    console.log(`refresh`, err);
    ctx.staus = 400;
  }
});

router.get("/token", auth, koaJwt({ secret: secret }), async (ctx) => {
  try {
    const usr = await _axios.post("/v1/users/find", {
      email: ctx.state.user.email,
      name: ctx.state.user.name,
    });
    const { name, key, role, avatar_url } = usr.data;
    delete usr;
    ctx.body = { user_info: { name, email, avatar_url } };
  } catch (err) {
    ctx.status = 400;
    console.log(`token login`, err);
  }
});

module.exports = router;
