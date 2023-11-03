var express = require("express");
var router = express.Router();
const Course = require("../models/Courses");

router.get("/", async function (req, res, next) {
  try {
    const user_id = req.query.user_id;
    const token = req.query.token;

    const courses = await Course.find({ user_id });

    const course_names = courses.map((i) => i.course_name);
    const attended_days = courses.map((i) => i.attended_days);
    const total_days = courses.map((i) => i.total_days);

    res.render("courses", {
      user_id,
      course_names,
      attended_days,
      total_days,
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/add", async function (req, res, next) {
  try {
    const course_name = req.body.course_name;
    var attended_days = Number(req.body.attended_days);
    var total_days = Number(req.body.total_days);

    const user_id = req.body.user_id;
    const token = req.body.token;

    if (!course_name) {
      return res.status(400).send("Course name is required");
    }

    if (attended_days > total_days) {
      return res.status(400).send("Attended days can't bigger than total days");
    }

    await Course.findOneAndUpdate(
      { user_id, course_name }, // Find the course with matching user_id and course_name
      { attended_days, total_days }, // Update the attended_days and total_days
      { new: true, upsert: true } // Create a new course if it doesn't exist
    );

    res.redirect(`/courses?token=${token}&user_id=${user_id}`);
  } catch (error) {
    next(error);
  }
});

router.post("/delete", async function (req, res, next) {
  try {
    const user_id = req.body.user_id;
    const token = req.body.token;
    const deleted_course = req.body.deleted_course;

    console.log(req.body);

    // deleted_course ile eşleşen şemaları bul ve sil
    await Course.deleteMany({ user_id: user_id, course_name: deleted_course });

    res.redirect(`/courses?token=${token}&user_id=${user_id}`);
  } catch (error) {
    next(error);
  }
});

router.post("/daily", async function (req, res, next) {
  try {
    const user_id = req.body.user_id;
    const token = req.body.token;
    const course_name = req.body.daily_course;
    const check = req.body.checkbox;

    if (typeof check !== "undefined") {
      await Course.findOneAndUpdate(
        { user_id: user_id, course_name: course_name },
        { $inc: { total_days: 1, attended_days: 1 } },
        { new: true }
      );
      res.redirect(`/courses?token=${token}&user_id=${user_id}`);
    } else {
      await Course.findOneAndUpdate(
        { user_id: user_id, course_name: course_name },
        { $inc: { total_days: 1 } },
        { new: true }
      );
      res.redirect(`/courses?token=${token}&user_id=${user_id}`);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", function (req, res, next) {
  res.render("logout");
});

module.exports = router;
