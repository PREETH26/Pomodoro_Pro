const mongoose = require("mongoose");

const teamTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pomodoros: {
      type: Number,
      default: 1,
      min: 1,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "live", "completed"],
      default: "pending",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 relates to your User model
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // 👈 array of Users
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamTask", teamTaskSchema);
