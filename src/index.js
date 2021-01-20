const Router = require("koa-router");

const login = require("./login");
const resume = require("./resume");

const router = new Router();

router.use(login.routes());
router.use(resume.routes());

module.exports = router;
