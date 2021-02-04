const Router = require("koa-router");
const koaJwt = require("koa-jwt");
const fs = require("fs");
const path = require("path");

const { secret } = require("../app.config");

const router = new Router({ prefix: "/resume/:id" });

const routes = fs
  .readdirSync(__dirname)
  .map((dir) => {
    if (dir.endsWith(".js")) return;
    let route = require(path.join(__dirname, dir, "index"));
    router.use(route.router.routes());
    return { key: dir, value: route };
  })
  .filter((v) => v !== undefined);

router.get("/", koaJwt({ secret: secret }), async (ctx) => {
  try {
    if (ctx.state.user.id !== ctx.params.id) {
      ctx.status = 403;
      return;
    }
    const body = {};
    for (let r of routes) {
      let result = await r.value.model.findById(ctx.params.id);
      if (!result) {
        result = new r.value.model({ id: ctx.params.id });
      }
      body[r.key] = result.data ? result.data : result;
    }

    ctx.status = 200;
    ctx.body = body;
  } catch (err) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
