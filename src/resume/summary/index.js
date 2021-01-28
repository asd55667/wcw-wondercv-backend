const Router = require("koa-router");
const koaJwt = require("koa-jwt");

const Summary = require("./model");
const { auth, authz, cache } = require("../../../middleware");
const { secret } = require("../../app.config");

const router = new Router({ prefix: "/summary" });

router.get("/", cache(300), koaJwt({ secret }), async (ctx) => {
  // if(ctx.state.user.id === ctx.params.id)
  const result = await Summary.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

router.post("/query", cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Summary.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.post("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    const newSummary = {};
    newSummary.summarys = ctx.request.body;
    newSummary._id = ctx.state.user.id;
    const user = new Summary(newSummary);
    await user.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.patch("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    if (ctx.state.user.id !== ctx.params.id) {
      ctx.status = 403;
      return;
    }
    const summarys = ctx.request.body;
    if (Array.isArray(summarys) && summarys.length > 30) {
      ctx.status = 403;
      return;
    }
    const newSummary = {};
    newSummary._id = ctx.params.id;
    newSummary.summarys = summarys;
    await Summary.findByIdAndUpdate(ctx.params.id, newSummary, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.delete("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    await Summary.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
