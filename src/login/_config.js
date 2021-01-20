/* 
  email
*/
const smtp = {
  host: "smtp.qq.com",
  user: "344078971@qq.com",
  authCode: "",

  // host: "smtp.163.com",
  // user: "wcw3440@163.com",
  // authCode: "",
  code() {
    return Math.random().toString(16).slice(2, 6).toUpperCase();
  },
  expire() {
    return new Date().getTime() + 60 * 8769 * 60 * 1000;
  },
};

const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  host: smtp.host,
  port: 587,
  secure: false,
  auth: {
    user: smtp.user,
    pass: smtp.authCode,
  },
});

const genEmailOpts = (email, code) => {
  return {
    from: `"认证邮件" <${smtp.user}>`,
    to: email,
    subject: "登录密码",
    html: `email为${email}用户，您的登录密码是${code}`,
  };
};

/* 
  github
*/
const githubConfig = {
  client_id: "",
  client_secret: "",
  expire() {
    return new Date().getTime() + 60 * 8769 * 60 * 1000;
  },
};

/* 
  common
*/
const secret = ["access_token", "refresh_token"];
const expires = {
  tmp_token: 300,
  access_token: 10,
  refresh_token: "180 days",
};

module.exports = {
  smtp,
  transporter,
  genEmailOpts,
  githubConfig,
  secret,
  expires,
};
