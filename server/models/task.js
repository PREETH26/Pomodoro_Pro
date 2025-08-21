// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // linking to User model
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    minutesSpent: {
      type: Number,
      default: 0, // increment when user spends time (via pomodoro timer)
    },
    pomodoros:{
      type: Number,
      default: 1
    },
    priority:{
      type: String,
      default: "Low"
    },
    completed: {
      type: Boolean,
      default: false,
    },
    status: { type: String, enum: ["pending", "live", "completed"], default: "pending" }
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Task", taskSchema);