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

const Skill = require("../../src/resume/skill/model");
describe("Skill module test", () => {
  before((done) => {
    //   before each test empty the database
    // console.log("before");
    Skill.deleteMany({}, () => {
      done();
    });
  });

  describe("POST /resume/:id/skill", () => {
    // console.log(1);
    it("it should to get a created info", (done) => {
      chai
        .request(server)
        .post(`/resume/${id}/skill`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.skill)
        .end((err, res) => {
          res.should.have.status(201);
          //   res.body.code.should.equal(0);
          done();
        });
    });
  });

  describe("GET /resume/:id/skill", () => {
    // console.log(2);
    it("it should to get a user's skill info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/skill`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          console.log("res\n", res.body);
          res.body.skill[0].desc.should.equal(info.skill[0].desc);
          done();
        });
    });
  });

  const desc = "wcwcw";
  describe("PATCH /resume/:id/skill", () => {
    // console.log(3);
    it("it should to get a update info", (done) => {
      info.skill[0].desc = desc;
      chai
        .request(server)
        .patch(`/resume/${id}/skill`)
        .set("Authorization", `Bearer ${access_token}`)
        .send(info.skill)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("GET /resume/:id/skill", () => {
    // console.log(2);
    it("it should to get a updated user's skill info", (done) => {
      chai
        .request(server)
        .get(`/resume/${id}/skill`)
        .set("Authorization", `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.skill[0].desc.should.equal(desc);
          done();
        });
    });
  });

  describe("DELETE /resume/:id/skill", () => {
    // console.log(4);
    it("it should to get a delete info", (done) => {
      chai
        .request(server)
        .delete(`/resume/${id}/skill`)
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
    Skill.deleteMany({}, () => {
      done();
    });
  });
});
