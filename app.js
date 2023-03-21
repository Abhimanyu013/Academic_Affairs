if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passportStudent = require("passport");
const cors = require("cors");

const initializePassportStudent = require("./passport-config-student.js");
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://kushuchiha358:e9PoM8N1yJsNq9s9@cluster0.8nxusvu.mongodb.net/test",
  {
    useNewUrlParser: true,
  }
);

initializePassportStudent(
  passportStudent,
  (email) => Student.findOne({ email: email }),
  (id) => id
);

app.use(cors());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passportStudent.initialize());
app.use(passportStudent.session());
const StudentSchema = {
  name: String,
  EmailID: String,
  DOB: Date,
  password: String,
};

const GlobalSchema = {
  name: String,
  email: String,
  DOB: Date,
  password: String,
};

const Student = mongoose.model("Student", StudentSchema);
const preStudent = mongoose.model("preStudent", GlobalSchema);

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const date = new Date();
const kush = new preStudent({
  name: "Kush",
  email: "202001104@daiict.ac.in",
  DOB: date.getDate(),
  password: "hello",
});

kush.save();

// const naruto = new Item({
//   name: "naruto",
// });
// const sasuke = new Item({
//   name: "sasuke",
// });
const defaultnames = [kush];
const saltRounds = 10;
app.use(express.static("public"));

app.get("/signup", function (req, res) {
  res.render("signup.ejs");
});

app.post("/signup", (req, res) => {
  function generateP() {
    var pass = "";
    var str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 10; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  Student.findOne({ email: req.body.email })
    .then((student) => {
      const randomPass = generateP();
      bcrypt
        .hash(randomPass, saltRounds)
        .then((hashedPassword) => {
          const newStudent = new Student({
            email: req.body.email,
            password: hashedPassword,
          });

          newStudent.save();

          var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "kushshah358@gmail.com",
              pass: process.env.PASSWORD,
            },
          });

          var mailOptions = {
            from: "202001104@daiict.ac.in",
            to: req.body.email,
            subject: "Student Information System",
            text: `Your account has been created! Your password is ${randomPass}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log(req.user + "\n" + req.body.email);
              console.log("Email sent: " + info.response);
            }
          });

          res.redirect("/login");
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.post("/", function (req, res) {
  const student1 = new Student({
    name: req.body.name,
    email: req.body.email,
    DOB: req.body.dob,
  });

  student1.save();
  console.log(student1.DOB);
  //   console.log(student1);

  preStudent
    .findOne({
      name: student1.name,
      EmailID: student1.EmailID,
    })
    .then((studentfound) => {
      console.log(studentfound);
      if (studentfound) {
        res.redirect("/login");
      } else res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.post(
  "/login",
  passportStudent.authenticate("student", {
    successRedirect: "/StudentHome",
    failureRedirect: "login",
    failureFlash: true,
  })
);

app.listen(3030, function () {
  console.log("server is active");
});
