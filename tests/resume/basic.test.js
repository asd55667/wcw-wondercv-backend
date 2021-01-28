const chai = require("chai");
let chaiHttp = require("chai-http");

const {
  server,
  access_token,
  refresh_token,
  info,
  id,
} = require("../test.config");

const should = chai.should();
chai.use(chaiHttp);

const Basic = require("../../src/resume/basic/model");
describe("Basic module test", () => {
  before((done) => {
    //   before each test empty the database
    // console.log("before");
    Basic.deleteMany({}, () => {
      done();
    });
  });

  describe("POST /resume/basic", () => {
    // console.log(1);
    it("it should to get a created info", (done) => {
      chai
        .request(server)
        .post(`/resume/${id}/basic`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.basic)
        .end((err, res) => {
          res.should.have.status(201);
          //   res.body.code.should.equal(0);
          done();
        });
    });
  });

  describe("GET /resume/basic", () => {
    // console.log(2);
    it("it should to get a user's basic info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/basic`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.user.name.value.should.equal(info.basic.user.name.value);
          done();
        });
    });
  });

  const name = "wcwcw";
  describe("PATCH /resume/basic", () => {
    // console.log(3);
    it("it should to get a update info", (done) => {
      info.basic.user.name.value = name;
      chai
        .request(server)
        .patch(`/resume/${id}/basic`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.basic)
        .end((err, res) => {
          res.should.have.status(200);
          //   res.body.code.should.equal(0)
          done();
        });
    });
  });

  describe("GET /resume/basic", () => {
    // console.log(2);
    it("it should to get a user's basic info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/basic`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          // console.log(res.body.user.name.value);
          res.body.user.name.value.should.equal(name);
          done();
        });
    });
  });

  describe("DELETE /resume/basic", () => {
    // console.log(4);
    it("it should to get a delete info", (done) => {
      chai
        .request(server)
        .delete(`/resume/${id}/basic`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    //   after each test we empty the database
    // console.log("after");
    Basic.deleteMany({}, () => {
      done();
    });
  });
});
