const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const app = require("../app"); // Your backend app file

chai.use(chaiHttp);

describe("http://localhost:3030", () => {
  describe("GET /Faculty_Login", () => {
    it("should return a 200 status code", async () => {
      const res = await chai.request(app).get("/Faculty_Login");
      expect(res).to.have.status(200);
    });
  });

  describe("POST /Faculty_Login", () => {
    it("should return a 200 status code", async () => {
      const res = await chai
        .request(app)
        .post("/Faculty_Login")
        .send({ email: "kushshah358@gmail.com", password: "320G#Gfc#k" });
      expect(res).to.have.status(200);
    });

    it("should return a 200 status code", async () => {
      const res = await chai
        .request(app)
        .post("/Faculty_Login")
        .send({ email: "kushshah358@gmail.com", password: "1234" });
      expect(res).to.have.status(200);
    });
  });
  describe("GET /Faculty_Home", () => {
    it("should return a 205 status code", async () => {
      const res = await chai.request(app).get("/Faculty_Home");
      expect(res).to.have.status(205);
    });
  });
});
