// models/Task.js
import mongoose from "mongoose";

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
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
