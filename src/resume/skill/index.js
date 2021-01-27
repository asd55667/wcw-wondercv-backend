const Router = require("koa-router");
const koaJwt = require("koa-jwt");

const Skill = require("./model");
const { auth, authz, cache } = require("../../../middleware");
const { secret } = require("../../app.config");

const router = new Router({ prefix: "/skill" });

router.get("/", cache(300), authz("user:list"), async (ctx) => {
  try {
    const result = await Skill.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.get("/:id", cache(300), koaJwt({ secret }), async (ctx) => {
  // if(ctx.state.user.id === ctx.params.id)
  console.log(ctx.params.id);
  const result = await Skill.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

router.post("/query", cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Skill.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.post("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    console.log(ctx.request.body);
    // const newUser = Object.assign({}, ctx.request.body);
    const newUser = {};
    newUser.skill = ctx.request.body;
    newUser._id = ctx.state.user.id;
    console.log(newUser);
    const user = new Skill(newUser);
    await user.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.patch("/:id", auth, koaJwt({ secret }), async (ctx) => {
  try {
    if (ctx.state.user.id !== ctx.params.id) {
      ctx.status = 403;
      return;
    }
    const skill = ctx.request.body;
    if (Array.isArray(skill) && skill.length > 30) {
      ctx.status = 403;
      return;
    }
    const newSkill = {};
    newSkill._id = ctx.params.id;
    newSkill.skill = skill;
    await Skill.findByIdAndUpdate(ctx.params.id, newSkill, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.delete("/:id", auth, koaJwt({ secret }), async (ctx) => {
  try {
    await Skill.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
