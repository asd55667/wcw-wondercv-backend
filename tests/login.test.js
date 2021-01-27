console.log("Starting login-test");

const chai = require("chai");
let chaiHttp = require("chai-http");
const Redis = require("ioredis");

const { server, access_token, refresh_token, email } = require("./test.config");

const should = chai.should();
chai.use(chaiHttp);
const redis = new Redis();

describe("login", () => {
  describe("/POST /login/email/code", () => {
    it("it should get email already sent info", (done) => {
      chai
        .request(server)
        .post("/login/email/code")
        .send({ email })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.equal(0);
          done();
        });
    });
  });

  describe("/POST /login/email", () => {
    it("it should get 2 tokens", async (done) => {
      const code = await redis.hget(`nodemail:${email}`, "code").then(done());
      chai
        .request(server)
        .post("/login/email")
        .send({ email, valCode: code })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.equal(0);
          res.body.should.have.property("access_token");
          res.body.should.have.property("refresh_token");
        });
    });
  });

  describe("/GET /login/token", () => {
    it("it should get user info", (done) => {
      chai
        .request(server)
        .get("/login/token")
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("/GET /login/token/refresh", () => {
    it("it should get 1 token", (done) => {
      chai
        .request(server)
        .get("/login/token/refresh")
        .set("Authorization", `Bearer ${refresh_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.equal(0);
          res.body.should.have.property("access_token");
          done();
        });
    });
  });

  afterEach((done) => {
    // after each test we empty the database
    redis
      .flushall()
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
