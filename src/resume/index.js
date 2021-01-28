const Router = require("koa-router");

const basic = require("./basic");
const education = require("./edu");
const job = require("./job");
const project = require("./project");
const skill = require("./skill");
const summary = require("./summary");
// const custom = require("./custom");

const router = new Router({ prefix: "/resume/:id" });

router.use(basic.routes());
router.use(education.routes());
router.use(job.routes());
router.use(project.routes());
router.use(skill.routes());
router.use(summary.routes());
// router.use(custom.routes());

router.get("/", (ctx, next) => {
  console.log(ctx.params);
  ctx.body = "123";
  next();
});

module.exports = router;
