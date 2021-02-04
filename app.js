// koa family
const Koa = require("koa");
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const koaJson = require("koa-json");
const conditional = require("koa-conditional-get");
const etag = require("koa-etag");
const cors = require("koa2-cors");
const helmet = require("koa-helmet");
const mongoose = require("mongoose");

// local
const router = require("./src");
const { requestLogger, logger } = require("./middleware/logger");
const { responseTime, errors } = require("./middleware");

// instance
const app = new Koa();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wcw-wondercv",
  // process.env.RESUME_MONGO
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;
db.on("error", (err) => {
  logger.error(err);
});
db.once("connected", () => {
  logger.info("Mongo connected");
  app.emit("ready");
});
db.on("reconnected", () => {
  logger.info("Mongo re-connected");
});
db.on("disconnected", () => {
  logger.info("Mongo disconnected");
});

// middlewares
app.use(errors);
app.use(conditional());
app.use(etag());
app.use(bodyParser());
app.use(koaJson());
// app.use(helmet());
app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    // credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "Accept", "wcw-key"],
    // exposeHeaders: ["wcw-api-cache", "wcw-api-response-time"],
  })
);
app.use(responseTime);
// app.use(requestLogger);
// app.use(static(__dirname + "/public"));
app.use(static("/Users/Src/MyProject/vue/resume/dist"));
app.use(router.routes()); //.use(router.allowedMethods());

module.exports = app;
