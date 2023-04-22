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
const passportFaculty = require("passport");
const cors = require("cors");
// const popup = require("popups");

const initializePassportStudent = require("./passport-config-student.js");
const initializePassportFaculty = require("./passport-config-faculty.js");

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

initializePassportFaculty(
  passportFaculty,
  (email) => Faculty.findOne({ email: email }),
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
  student_ID: String,
  name: String,
  gender: String,
  date_Of_Birth: Date,
  email: String,
  password: String,
};

const BroadcastSchema = {
  broadcasts: String,
  date_Of_Broadcast: Date,
  time_Of_Broadcast: Date,
};

app.use(passportFaculty.initialize());
app.use(passportFaculty.session());
const FacultySchema = {
  email: String,
  password: String,
  faculty_ID: Number,
  name: String,
  gender: String,
  alma_Mater: String,
  date_Of_Joining: Date,
};

const Student = mongoose.model("Student", StudentSchema);
// const preStudent = mongoose.model("preStudent", GlobalSchema);
const Faculty = mongoose.model("Faculty", FacultySchema);
// const preFaculty = mongoose.model("preFaculty", FacultySchema);
const Broadcast = mongoose.model("Broadcast", BroadcastSchema);

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const date = new Date();
const kush = new Student({
  student_ID: "202001104",
  name: "Kush",
  gender: "Male",
  date_Of_Birth: new Date(),
  email: "202001104@daiict.ac.in",
  password: "hello",
});

const prof1 = new Faculty({
  email: "kushshah358@gmail.com",
  password: "123",
  faculty_ID: 1,
  name: "Kush Shah",
  gender: "male",
  alma_Mater: "DAIICT",
  date_Of_Joining: "04.05.2017",
});

// prof1.save();
Faculty.find({}).then((faculty) => {
  if (faculty.length == 0) prof1.save();
});
Student.find({}).then((Students) => {
  if (Students.length == 0) kush.save();
});

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

app.get("/faculty", function (req, res) {
  res.render("Faculty_Login.ejs");
});

app.get("/Admin_Login", function (req, res) {
  res.render("Admin_Login.ejs");
});

app.get("/Admin_Home", function (req, res) {
  res.render("Admin_Home.ejs");
});

app.get("/Student_Home", checkAuthenticatedStudent, (req, res) => {
  res.render("Student_Home");
});

app.get(
  "/Student_Home_Login",
  checkNotAuthenticatedStudent,
  function (req, res) {
    res.render("Student_Home_Login.ejs");
  }
);

app.get("/Faculty_Login", checkNotAuthenticatedFaculty, function (req, res) {
  res.status(200).render("Faculty_Login.ejs");
});

app.get("/Faculty_Home", checkAuthenticatedFaculty, (req, res) => {
  res.render("Faculty_Home.ejs");
});

app.get("/Faculty_Info", checkAuthenticatedFaculty, (req, res) => {
  Faculty.findOne({ _id: req.user }).then((faculty) => {
    res.render("Faculty_Info.ejs", { faculty });
  });
});

app.get("/Student_Info", checkAuthenticatedFaculty, (req, res) => {
  Student.findOne({ _id: req.user }).then((student) => {
    res.render("Student_Info.ejs", { student });
  });
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/Faculty_Signup", (req, res) => {
  res.render("Faculty_Signup");
});

app.get("/Student_Login", function (req, res) {
  res.render("Student_Home_Login.ejs");
});

app.get("/", function (req, res) {
  res.render("Main_Lander.ejs");
});

app.get("/Admin_BroadCasts", function (req, res) {
  Broadcast.find({}).then((broadcast) => {
    res.render("Admin_BroadCasts.ejs", { broadcast });
  });
});

app.get("/Admin_Student_Info", function (req, res) {
  console.log("hello");
  // res.render("Admin_Student_Info.ejs");
  Student.find({}).then((student) => {
    res.render("Admin_Student_Info.ejs", { student });
  });
});

app.get("/Admin_Faculty_Info", function (req, res) {
  console.log("hello");
  // res.render("Admin_Student_Info.ejs");
  Faculty.find({}).then((faculty) => {
    res.render("Admin_Faculty_Info.ejs", { faculty });
  });
});

app.post("/signup", function (req, res) {
  res.render("login.ejs");
});

app.post(
  "/Faculty_Login",
  passportFaculty.authenticate("faculty", {
    successRedirect: "/Faculty_Home",
    failureRedirect: "/Faculty_Login",
    failureFlash: true,
  })
);

app.post(
  "/Student_Home",
  passportStudent.authenticate("student", {
    successRedirect: "/Student_Home",
    failureRedirect: "/Student_Home_Login",
    failureFlash: true,
  })
);

app.post("/Student_Home_Login", (req, res) => {
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
      if (student) {
        const randomPass = generateP();
        bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
          Student.findOneAndUpdate(
            { email: student.email },
            { password: hashedPassword, date_Of_Birth: req.body.DOB }
          ).then((x) => {
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
              } // else {
              //   console.log(req.user + "\n" + req.body.email);
              //   console.log("Email sent: " + info.response);
              // }
            });

            res.redirect("/Student_Login");
          });
        });
      } else res.redirect("/Student_Home_Login");
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.post("/Faculty_Signup", (req, res) => {
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

  Faculty.findOne({ email: req.body.email })
    .then((faculty) => {
      if (faculty) {
        const randomPass = generateP();
        bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
          Faculty.findOneAndUpdate(
            { email: faculty.email },
            { password: hashedPassword }
          ).then((x) => {
            console.log(x);
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

            res.redirect("/Faculty_Login");
          });
        });
      }
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

  Student.findOne({
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

app.post("/Admin_Login", function (req, res) {
  if (
    req.body.username === process.env.Admin_name &&
    req.body.password === process.env.Admin_pswd
  ) {
    console.log(process.env.Admin_pswd);
    res.redirect("/Admin_Home");
  } else {
    console.log(process.env.Admin_pswd);
    res.redirect("/Admin_Login");
  }
});

app.post("/Admin_BroadCasts", function (req, res) {
  const broadcastnew = new Broadcast({
    broadcasts: req.body.Broadcast,
    date_Of_Broadcast: new Date(),
    time_Of_Broadcast: new Date(),
  });
  broadcastnew.save();
  res.redirect("/Admin_Broadcasts");
  // Broadcast.find({}).then((broadcast) => {
  //   res.render("Admin_BroadCasts.ejs", { broadcast });
  // });
});
// app.post(
//   "/login",
//   passportStudent.authenticate("student", {
//     successRedirect: "/StudentHome",
//     failureRedirect: "login",
//     failureFlash: true,
//   })
// );

app.post("/logoutStudent", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log("hello");
    res.redirect("/");
  });
});

app.post("/logoutFaculty", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log("hello");
    res.redirect("/");
  });
});

function checkAuthenticatedStudent(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/Student_Login");
}

function checkAuthenticatedFaculty(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  ``;
  res.redirect("/Faculty_Login");
}

function checkNotAuthenticatedStudent(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/Student_Home");
  }
  next();
}
function checkNotAuthenticatedFaculty(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/Faculty_Home");
  }
  next();
}

if (!module.parent) {
  app.listen(3030, function () {
    console.log("server is active");
  });
}

module.exports = app;
