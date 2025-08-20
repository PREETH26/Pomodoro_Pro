const express = require("express");
const router = express.Router();
const TeamTask = require("../models/teamTask");
const authMiddleware = require("../middleware/authmiddleware");

// POST: Create a task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, pomodoros, priority, deadline, assignedTo } = req.body;

    // ✅ use req.userId instead of req.user._id
    const assignedBy = req.userId;

    const newTask = new TeamTask({
      name,
      pomodoros,
      priority,
      deadline,
      assignedBy,
      assignedTo,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/team-tasks/assigned-to-me
router.get("/assigned-to-me", authMiddleware, async (req, res) => {
  try {
    const tasks = await TeamTask.find({ assignedTo: req.userId })
      .populate("assignedBy", "name email")   // get info about who assigned
      .populate("assignedTo", "name email"); // get info about assignees

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// GET /api/team-tasks/assigned-by-me
router.get("/assigned-by-me", authMiddleware, async (req, res) => {
  try {
    const tasks = await TeamTask.find({ assignedBy: req.userId })
      .populate("assignedBy", "name email")
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});
// PATCH /api/team-tasks/:taskId/status
router.patch("/:taskId/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "live", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await TeamTask.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ensure only assigned user or assigner can update
    if (
      task.assignedBy.toString() !== req.userId &&
      !task.assignedTo.map((id) => id.toString()).includes(req.userId)
    ) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
});

module.exports = router;
