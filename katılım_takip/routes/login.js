var express = require("express");
var router = express.Router();

const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

router.get("/", function (req, res, next) {
  // var token = localStorage.getItem("token");
  console.log("123123123423423423543");
  res.render("login");
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        message: "USER NOT FOUND",
      });
    } else {
      const result = await bcrypt.compare(password, user.password);
      const user_id = user._id;
      if (!result) {
        res.status(401).json({
          message: "WRONG PASSWORD",
        });
      } else {
        const token = jwt.sign(
          {
            user_id,
          },
          req.app.get("api_secret_key"),
          {
            expiresIn: 720, // 12 mins
          }
        );
        // localStorage.setItem("token", token);
        res.redirect(`/courses?token=${token}&user_id=${user._id}`);
      }
    }
  } catch (err) {
    console.log("Caught error!");
    throw err;
  }
});

module.exports = router;
