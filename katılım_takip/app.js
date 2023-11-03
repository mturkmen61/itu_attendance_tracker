var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");

var mongoose = require("mongoose");
var signupRouter = require("./routes/signup");
var loginRouter = require("./routes/login");
var coursesRouter = require("./routes/courses");
var mainRouter = require("./routes/mainpage");

var app = express();

const config = require("./config");
app.set("api_secret_key", config.api_secret_key);

const verifyToken = require("./middleware/verify_token");

mongoose
  .connect(
    "mongodb+srv://mustafaturkmen2003:HyKx5ahiZaIKUdk0@cluster0.dtcs6id.mongodb.net/katilim_takip?retryWrites=true&w=majority"
  )
  .then(() => console.log("db success"))
  .catch((err) => {
    console.log("db error", err);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade", "pug");

// comment

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/signup", signupRouter);
app.use("/login", loginRouter);

app.use("/", mainRouter);
app.use("/courses", coursesRouter, verifyToken);
app.use("/courses/add", coursesRouter, verifyToken);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message, code: err.code });
});

module.exports = app;
