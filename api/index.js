const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const RegisterRequest = require("./requests/register")
const LoginRequest = require("./requests/login");
const FeedbackRequest = require("./requests/feedback_req");
const VideoFetch= require("./requests/videoFetch");


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

mongoose.connect(process.env.MONGO_URL)
const jwtSecret = process.env.JWTSECRET;

app.get("/", (req, res) => {
  res.json("lingo is on");
});

app.post("/register", RegisterRequest);
app.post("/login", LoginRequest);
app.post("/submit-feedback",FeedbackRequest)
app.get('/videos/:langid', VideoFetch);

app.post("/logout", (req, res) => {
  res.cookie("token","").json(true);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userinfo) => {
      if (err) throw err;
      res.json(userinfo);
    });
  } else {
    res.json(null);
  }
});



app.listen(4000);

// express ->server set up post get listen
// mongoose-> mongodb connect define database
// cors-> 4000 server communication client 3000
// bcryptjs-> encryption pasword string cypher blowfish
// dotenv-> mongo oauth urls env
// axios -> client---> server pe requests
