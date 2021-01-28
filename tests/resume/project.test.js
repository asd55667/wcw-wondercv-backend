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

const Project = require("../../src/resume/project/model");
describe("Project module test", () => {
  before((done) => {
    Project.deleteMany({}, () => {
      done();
    });
  });

  describe("POST /resume/:id/project", () => {
    it("it should to get a created info", (done) => {
      chai
        .request(server)
        .post(`/resume/${id}/project`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.projects)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe("GET /resume/:id/project", () => {
    it("it should to get a user's project info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/project`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.projects[0].desc.should.equal(info.projects[0].desc);
          done();
        });
    });
  });

  const desc = "wcwcw";
  describe("PATCH /resume/:id/project", () => {
    it("it should to get a update info", (done) => {
      info.projects[0].desc = desc;
      chai
        .request(server)
        .patch(`/resume/${id}/project`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.projects)
        .end((err, res) => {
          res.should.have.status(200);
          //   res.body.code.should.equal(0)
          done();
        });
    });
  });

  describe("GET /resume/:id/project", () => {
    it("it should to get a updated user's project info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/project`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.projects[0].desc.should.equal(desc);
          done();
        });
    });
  });

  describe("DELETE /resume/:id/project", () => {
    it("it should to get a delete info", (done) => {
      chai
        .request(server)
        .delete(`/resume/${id}/project`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    Project.deleteMany({}, () => {
      done();
    });
  });
});
