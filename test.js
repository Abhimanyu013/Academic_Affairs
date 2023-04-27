const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const app = require("../app"); // Your backend app file

chai.use(chaiHttp);

    describe("POST /Student_Home", () => {
    it("should return a 800 status code", async () => {
      const res = await chai
        .request(app)
        .post("/Student_Home")
        .send({ email: "202001104@daiict.ac.in", password: "paword" });
      expect(res).to.have.status(200);
    });
  });

// describe('test collection 3',()=>{
    

//   it('test valid faculty login route...', (done) => {
//     const credentials = {
//       email: 'kushshah358@gmail.com',
//       password: 'password'
//     };
//     chai.request(app)
//       .post("/Faculty_Login")
//       .send(credentials)
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         // expect(res.body.token).to.exist;
//         done();
//       });
//   });
  
// });



  // describe("POST /Faculty_Login", () => {
  //   it("should return a 200 status code", async () => {
  //     const res = await chai
  //       .request(app)
  //       .post("/Faculty_Login")
  //       .send({ email: "kushshah358@gmail.com", password: "320G#Gfc#k" });
  //     expect(res).to.have.status(300);
  //   });


// describe("http://localhost:3030", () => {
//   describe("GET /Faculty_Login", () => {
//     it("should return a 200 status code", async () => {
//       const res = await chai.request(app).get("/Faculty_Login");
//       expect(res).to.have.status(200);
//     });
//   });

  // describe("POST /Faculty_Login", () => {
  //   it("should return a 200 status code", async () => {
  //     const res = await chai
  //       .request(app)
  //       .post("/Faculty_Login")
  //       .send({ email: "kushshah358@gmail.com", password: "320G#Gfc#k" });
  //     expect(res).to.have.status(300);
  //   });

    // it("should return a 200 status code", async () => {
    //   const res = await chai
    //     .request(app)
    //     .post("/Faculty_Login")
    //     .send({ email: "kushshah358@gmail.com", password: "1234" });
    //   expect(res).to.have.status(200);
    // });


// it('test default faculty login route...',(done)=>{

//     chai.request(app)
//     .get('/Faculty_Login')
//     .end((err,res) => {
//       expect(res).to.have.status(200);
//       // expect(res.body).to.be.a('object');
//       console.log(res.body.message);
//       const actualVal= res.body.message;
//       expect(actualVal).to.be.equal('some random text')
//       done();
//     });
//   });