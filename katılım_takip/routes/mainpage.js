var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");

// var LocalStorage = require("node-localstorage").LocalStorage;
// var localStorage = new LocalStorage("./scratch");

router.get("/", function (req, res) {
  res.render("mainpage");
});

router.get("/tokenChecker", function (req, res) {
  var token = req.query.token;
  console.log("get token: ", token);
  if (token) {
    try {
      const decoded = jwt.verify(token, req.app.get("api_secret_key"));
      console.log("Decoded:", decoded);

      res.redirect(`/courses?token=${token}&user_id=${decoded.user_id}`);
    } catch (err) {
      console.error(err);
      res.redirect("/login");
    }
  } else {
    console.log("12312312");
    res.redirect("/login");
  }
});

router.post("/", function (req, res) {
  var token = req.body.token;
  console.log("get token: ", token);
  if (token) {
    try {
      const decoded = jwt.verify(token, req.app.get("api_secret_key"));
      console.log("Decoded:", decoded);

      res.redirect(`/courses?token=${token}&user_id=${decoded.user_id}`);
    } catch (err) {
      console.error(err);
      res.redirect("/login");
    }
  } else {
    console.log("12312312");
    res.redirect("/login");
  }
});

module.exports = router;
