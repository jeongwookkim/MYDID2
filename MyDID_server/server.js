const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const connect = require("./schemas");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;

connect();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.static(path.join(__dirname, "public")));

fs.readdir("public", (error) => {
  // public 폴더 없으면 생성
  if (error) {
    fs.mkdirSync("public");
    console.log("pulic 폴더 생성됨");
    fs.readdir("public/upload", (error) => {
      // uploads 폴더 없으면 생성
      if (error) {
        fs.mkdirSync("public/upload");
        console.log("upload 폴더 생성됨");
      }
    });
  }
});

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "hamletshu",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.post('/captcha', function(req, res) {
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
  {
    return res.json({"responseError" : "something goes to wrong"});
  }
  const secretKey = "6LeD4f8UAAAAAMyDtD-f1aqByo7xxx4FhBgmumi2";
 
  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&amp;response=" + req.body['g-recaptcha-response'] + "&amp;remoteip=" + req.connection.remoteAddress;
 
  request(verificationURL,function(error,response,body) {
    body = JSON.parse(body);
 
    if(body.success !== undefined && !body.success) {
      return res.json({"responseError" : "Failed captcha verification"});
    }
    res.json({"responseSuccess" : "Success"});
  });
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/member", require("./routes/memberRouter"));
app.use("/board", require("./routes/boardRouter"));
app.use("/auth", require("./routes/authRouter"));
app.use("/comment", require("./routes/commentRouter"));

app.listen(8080, () => {
  console.log("listen umm..umm..um...");
});
