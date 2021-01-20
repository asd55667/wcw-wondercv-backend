const Router = require("koa-router");

const { auth } = require("../../middleware");

const router = new Router();

router.get("unregister", auth, async (ctx) => {});

module.exports = router;
