const Router = require("koa-router");

const basic = require("./basic");
// const custom = require("./custom");
// const education = require("./education");
// const job = require("./job");
// const project = require("./project");
const skill = require("./skill");
// const summary = require("./summary");

const router = new Router({ prefix: "/resume" });

router.use(basic.routes());
// router.use(custom.routes());
// router.use(education.routes());
// router.use(job.routes());
// router.use(project.routes());
router.use(skill.routes());
// router.use(summary.routes());

module.exports = router;
