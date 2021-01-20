// const mongoose = require("mongoose");

// const db = mongoose.connection.useDb("wcw-wondercv", { useCache: true });
// const db = mongoose.connection;
// console.log(db);

/**
 * Authentication middleware
 */
module.exports = async (ctx, next) => {
  const key = +ctx.request.headers["wcw-key"];

  // console.log(typeof key);
  console.log("auth");
  if (key) {
    // const user = await db.collection("users").findOne({ key });
    // if (user?.key === key) {
    if (123 === key) {
      // ctx.state.roles = user.roles;
      await next();
      return;
    }
  }
  ctx.status = 401;
  ctx.body = "go home";
};
