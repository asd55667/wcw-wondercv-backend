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

const Education = require("../../src/resume/edu/model");
describe("Education module test", () => {
  before((done) => {
    Education.deleteMany({}, () => {
      done();
    });
  });

  describe("POST /resume/:id/edu", () => {
    it("it should to get a created info", (done) => {
      chai
        .request(server)
        .post(`/resume/${id}/edu`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.edus)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe("GET /resume/:id/edu", () => {
    it("it should to get a user's edu info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/edu`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.edus[0].desc.should.equal(info.edus[0].desc);
          done();
        });
    });
  });

  const desc = "wcwcw";
  describe("PATCH /resume/:id/edu", () => {
    it("it should to get a update info", (done) => {
      info.edus[0].desc = desc;
      chai
        .request(server)
        .patch(`/resume/${id}/edu`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.edus)
        .end((err, res) => {
          res.should.have.status(200);
          //   res.body.code.should.equal(0)
          done();
        });
    });
  });

  describe("GET /resume/:id/edu", () => {
    it("it should to get a updated user's edu info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/edu`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.edus[0].desc.should.equal(desc);
          done();
        });
    });
  });

  describe("DELETE /resume/:id/edu", () => {
    it("it should to get a delete info", (done) => {
      chai
        .request(server)
        .delete(`/resume/${id}/edu`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    Education.deleteMany({}, () => {
      done();
    });
  });
});
