const Router = require("koa-router");
const koaJwt = require("koa-jwt");

const Basic = require("./model");
const { auth, authz, cache } = require("../../../middleware");
const { secret } = require("../../app.config");

const router = new Router({ prefix: "/basic" });

router.get("/", cache(300), koaJwt({ secret }), async (ctx) => {
  try {
    if (ctx.state.user.id !== ctx.params.id) {
      ctx.status = 403;
      return;
    }
    const result = await Basic.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404);
    }
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.post("/query", cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Basic.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.post("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    // console.log(ctx.request.body, ctx.state.user.id);
    const newUser = Object.assign(ctx.request.body);
    newUser._id = ctx.state.user.id;
    try {
      const user = new Basic(newUser);
      await user.save();
      ctx.status = 201;
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.patch("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    await Basic.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.delete("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    await Basic.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = { router, model: Basic };
