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

const Summary = require("../../src/resume/summary/model");
describe("Summary module test", () => {
  before((done) => {
    Summary.deleteMany({}, () => {
      done();
    });
  });

  describe("POST /resume/:id/summary", () => {
    it("it should to get a created info", (done) => {
      chai
        .request(server)
        .post(`/resume/${id}/summary`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.summarys)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe("GET /resume/:id/summary", () => {
    it("it should to get a user's summary info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/summary`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.summarys[0].desc.should.equal(info.summarys[0].desc);
          done();
        });
    });
  });

  const desc = "wcwcw";
  describe("PATCH /resume/:id/summary", () => {
    it("it should to get a update info", (done) => {
      info.summarys[0].desc = desc;
      console.log(`info, ${info.summaryss}`);
      chai
        .request(server)
        .patch(`/resume/${id}/summary`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.summarys)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("GET /resume/:id/summary", () => {
    it("it should to get a updated user's summary info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/summary`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.summarys[0].desc.should.equal(desc);
          done();
        });
    });
  });

  describe("DELETE /resume/:id/summary", () => {
    it("it should to get a delete info", (done) => {
      chai
        .request(server)
        .delete(`/resume/${id}/summary`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    Summary.deleteMany({}, () => {
      done();
    });
  });
});
