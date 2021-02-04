const Router = require("koa-router");
const koaJwt = require("koa-jwt");

const Education = require("./model");
const { auth, authz, cache } = require("../../../middleware");
const { secret } = require("../../app.config");

const router = new Router({ prefix: "/edu" });

router.get("/", cache(300), koaJwt({ secret }), async (ctx) => {
  const result = await Education.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

router.post("/query", cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Education.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// create
router.post("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    const newEdu = {};
    newEdu.edus = ctx.request.body;
    newEdu._id = ctx.state.user.id;
    const edu = new Education(newEdu);
    await edu.save();
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
    const edus = ctx.request.body;
    if (Array.isArray(edus) && edus.length > 30) {
      ctx.status = 403;
      return;
    }
    const newEdu = {};
    newEdu._id = ctx.params.id;
    newEdu.edus = edus;

    await Education.findByIdAndUpdate(ctx.params.id, newEdu, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.delete("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    await Education.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = { router, model: Education };
