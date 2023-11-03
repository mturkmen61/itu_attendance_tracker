const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  attended_days: {
    type: Number,
    required: true,
  },
  total_days: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
