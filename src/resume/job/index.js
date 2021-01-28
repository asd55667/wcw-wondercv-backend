const Router = require("koa-router");
const koaJwt = require("koa-jwt");

const Job = require("./model");
const { auth, authz, cache } = require("../../../middleware");
const { secret } = require("../../app.config");

const router = new Router({ prefix: "/job" });


router.get("/", cache(300), koaJwt({ secret }), async (ctx) => {
  const result = await Job.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

router.post("/query", cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Job.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// create
router.post("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    const newJob = {};
    newJob.jobs = ctx.request.body;
    newJob._id = ctx.state.user.id;
    const edu = new Job(newJob);
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
    const jobs = ctx.request.body;
    if (Array.isArray(jobs) && jobs.length > 30) {
      ctx.status = 403;
      return;
    }
    const newJob = {};
    newJob._id = ctx.params.id;
    newJob.jobs = jobs;

    await Job.findByIdAndUpdate(ctx.params.id, newJob, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.delete("/", auth, koaJwt({ secret }), async (ctx) => {
  try {
    await Job.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
