const axios = require("axios");

const config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  baseURL: "http://localhost:8127",
  timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  (config) => {
    config.headers["wcw-key"] = 234;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

_axios.interceptors.response.use(
  (response) => {
    // app.logs.push(JSON.stringify(response.data));
    return response;
  },
  (err) => {
    // app.logs.push(JSON.stringify(err.data));
    return Promise.reject(err);
  }
);

module.exports = _axios;
