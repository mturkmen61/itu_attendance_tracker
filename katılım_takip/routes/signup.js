var express = require("express");
var router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// var LocalStorage = require("node-localstorage").LocalStorage;
// localStorage = new LocalStorage("./scratch");

router.get("/", function (req, res, next) {
  res.render("signup");
});

router.post("/", async (req, res, next) => {
  const { username, password, password1 } = req.body;
  const hash = await bcrypt.hash(password, 10);

  if (!username) {
    return res.status(400).send("Username is required");
  }
  if (!password) {
    return res.status(400).send("Password is required");
  }
  if (password != password1) {
    return res.status(400).send("You have to enter same password");
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "Username is not available",
      });
    }

    const existingPassword = await User.findOne({ password });
    if (existingPassword) {
      return res.status(401).json({
        message: "Password is not available",
      });
    }

    const newUser = new User({
      username,
      password: hash,
    });

    const savedUser = await newUser.save();
    const user_id = savedUser._id;

    const token = jwt.sign(
      {
        user_id,
      },
      req.app.get("api_secret_key"),
      {
        expiresIn: 720, // 12 mins
      }
    );

    console.log("created token:", token);

    res.redirect(`/courses?token=${token}&user_id=${user_id}`);
  } catch (err) {
    console.log("Caught error!");
    throw err;
  }
});

module.exports = router;
