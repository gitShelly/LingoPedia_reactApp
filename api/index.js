const express = require("express");
const multer=require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { Readable } = require('stream');


const RegisterRequest = require("./requests/register");
const LoginRequest = require("./requests/login");
const FeedbackRequest = require("./requests/feedback_req");
const VideoFetch = require("./requests/videoFetch");
const fetchQuizdata = require("./requests/fect_quizdata");
const recorddata = require("./requests/recordRequest");
const fetchFeedback = require("./requests/feeback_fetch");
const addvideo = require("./requests/addvideo");
const deletevideo = require("./requests/deletevideo");
const fetchrecord = require("./requests/recordFetch");
const fetchpublicpdf=require('./requests/public_fetch');

const PrivateModel=require("./models/privatePdf");
const PublicModel=require("./models/publicPdf");
const fetchprivatepdf=require("./requests/fetch_private");
const privatedelete=require("./requests/delete_privatepdf");
const makePublicpdf=require("./requests/make_public")


var bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWTSECRET;

const conn = mongoose.connection;
let publicGfs;
let privateGfs;
conn.once("open", () => {
    publicGfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "public_pdfs"
    });
    privateGfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "private_pdfs"
    });
});

app.get("/", (req, res) => {
  res.json("lingo is on");
});

app.post("/register", RegisterRequest);
app.post("/login", LoginRequest);
app.post("/submit-feedback",FeedbackRequest)
app.get('/videos/:langid', VideoFetch);
app.get('/quizdata/:langid',fetchQuizdata);
app.post('/scorerecord',recorddata);
app.get('/fetch-feedback',fetchFeedback);
app.post("/videos/:langid/:level",addvideo)
app.get('/record-fetch/:userid',fetchrecord)
app.delete("/videos/:langid/:level",deletevideo)
app.delete("/delete-pdf",privatedelete)

app.post("/makePublic",makePublicpdf)
app.get("/fetch-public-files/:langID",fetchpublicpdf)
app.get("/fetch-private-files/:userid",fetchprivatepdf)


app.post("/submit-file", multer().none(), async (req, res) => {
  try {
    const { userId, lang, pdf, isPublic, file_name, isPrivate } = req.body;
    const filename = file_name;
    const readableStream = new Readable();
    readableStream.push(pdf);
    readableStream.push(null);

    let uploadStream;
    let bucket;

    if (isPublic) {
      bucket = publicGfs;
    } else {
      bucket = privateGfs;
    }

    // Check if the file with the same name and language exists
    let fileExists;
    if (isPublic) {
      fileExists = await PublicModel.exists({ lang, "pdf.filename": filename });
    } else {
      fileExists = await PrivateModel.exists({ lang, "pdf.filename": filename });
    }

    if (!fileExists) {
      // Create upload stream to appropriate GridFS bucket
      uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          userId,
          lang
        }
      });

      // Pipe the file data to GridFS
      readableStream.pipe(uploadStream);

      uploadStream.on("error", (error) => {
        console.error("Error uploading file:", error);
        res.status(500).json({ success: false, error: "Failed to upload file" });
      });

      uploadStream.on("finish", async () => {
        console.log("File uploaded successfully");

        if (isPrivate === "true" || isPrivate === true) {
          const privateFile = new PrivateModel({
            userId,
            lang,
            pdf: {
              filename,
              contentType: "application/pdf",
              data: pdf
            }
          });
          await privateFile.save();
        }

        if (isPublic === true || isPublic === "true") {
          const publicFile = new PublicModel({
            userId,
            lang,
            pdf: {
              filename,
              contentType: "application/pdf",
              data: pdf
            }
          });
          await publicFile.save();
        }

        res.json({ success: true });
      });
    } else {
      res.status(400).json({ success: false, error: "File with the same name and language already exists in the list of requested langid" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to submit file" });
  }
});



app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
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
