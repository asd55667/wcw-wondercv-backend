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

const Job = require("../../src/resume/job/model");
describe("Job module test", () => {
  before((done) => {
    Job.deleteMany({}, () => {
      done();
    });
  });

  describe("POST /resume/:id/job", () => {
    it("it should to get a created info", (done) => {
      chai
        .request(server)
        .post(`/resume/${id}/job`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.jobs)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe("GET /resume/:id/job", () => {
    it("it should to get a user's job info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/job`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.jobs[0].desc.should.equal(info.jobs[0].desc);
          done();
        });
    });
  });

  const desc = "wcwcw";
  describe("PATCH /resume/:id/job", () => {
    it("it should to get a update info", (done) => {
      info.jobs[0].desc = desc;
      chai
        .request(server)
        .patch(`/resume/${id}/job`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.jobs)
        .end((err, res) => {
          res.should.have.status(200);
          //   res.body.code.should.equal(0)
          done();
        });
    });
  });

  describe("GET /resume/:id/job", () => {
    it("it should to get a updated user's job info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/job`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.jobs[0].desc.should.equal(desc);
          done();
        });
    });
  });

  describe("DELETE /resume/:id/job", () => {
    it("it should to get a delete info", (done) => {
      chai
        .request(server)
        .delete(`/resume/${id}/job`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    Job.deleteMany({}, () => {
      done();
    });
  });
});
