const Router = require("koa-router");
const Redis = require("ioredis");
const querystring = require("querystring");
const axios = require("axios");
const uuidv4 = require("uuid").v4;

// jwt
const jwt = require("jsonwebtoken");
const koaJwt = require("koa-jwt");

const { auth } = require("../../middleware");
const _axios = require("../axios");
const { githubConfig, secret, expires } = require("../app.config");

const router = new Router({ prefix: "/github" });
const redis = new Redis();

router.get("/token", async (ctx) => {
  var path = `https://github.com/login/oauth/authorize?${querystring.stringify({
    client_id: githubConfig.client_id,
    redirect_uri: "http://localhost:8081/login/github/callback",
  })}`;
  ctx.redirect(path);
});

router.get("/callback", async (ctx) => {
  const code = ctx.query.code;
  // console.log(`code: ${code}`);

  const params = {
    client_id: githubConfig.client_id,
    client_secret: githubConfig.client_secret,
    code: code,
  };
  let res = await axios.post(
    "https://github.com/login/oauth/access_token",
    params
  );
  //  access_token for github
  const access_token = querystring.parse(res.data).access_token;

  console.log(`access_token: ${access_token}`);
  const uid = uuidv4();

  redis.hmset(
    `nodegit:${uid}`,
    "access_token",
    access_token,
    "expire",
    githubConfig.expire()
  );

  const tmp_token = jwt.sign(
    {
      uid,
    },
    secret[0],
    { expiresIn: expires.tmp_token }
  );

  ctx.response.type = "html";
  ctx.body = `
      <script> 
        window.localStorage.setItem('access_token','${tmp_token}')
        window.close()
      </script>
    `;

  // redis.del(`nodegit:${uid}`);
});

router.get("/", auth, koaJwt({ secret: secret }), async (ctx) => {
  const { uid } = ctx.state.user;
  const access_token = await redis.hget(`nodegit:${uid}`, "access_token");
  // del github token
  // redis.del(`nodegit:${uid}`);

  console.log("get", access_token);

  const header = {
    Authorization: `Bearer ${access_token}`,
  };

  const res = await axios({
    method: "GET",
    url: "https://api.github.com/user",
    headers: header,
  });

  const usr = await _axios.post("/v1/users/find", { name: res.data.login });

  const { name, email, key, role, avatar_url } = usr.data;

  const _access_token = jwt.sign(
    {
      name,
      id: key,
    },
    secret[0],
    { expiresIn: expires.access_token }
  );
  const refresh_token = jwt.sign(
    {
      name,
      id: key,
      role,
    },
    secret[1],
    { expiresIn: expires.refresh_token }
  );
  ctx.body = {
    code: 0,
    refresh_token,
    access_token: _access_token,
    uid: key,
    user_info: { name, email, avatar_url },
  };
});

module.exports = router;
