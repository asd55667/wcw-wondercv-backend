const Router = require("koa-router");
const koaJwt = require("koa-jwt");

const Project = require("./model");
const { auth, authz, cache } = require("../../../middleware");
const { secret } = require("../../app.config");

const router = new Router({ prefix: "/project" });

router.get("/", cache(300), koaJwt({ secret }), async (ctx) => {
  const result = await Project.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

router.post("/query", cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Project.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// create
router.post("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    const newProject = {};
    newProject.projects = ctx.request.body;
    newProject._id = ctx.state.user.id;
    const edu = new Project(newProject);
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
    const projects = ctx.request.body;
    if (Array.isArray(projects) && projects.length > 30) {
      ctx.status = 403;
      return;
    }
    const newProject = {};
    newProject._id = ctx.params.id;
    newProject.projects = projects;

    await Project.findByIdAndUpdate(ctx.params.id, newProject, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.delete("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    await Project.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
