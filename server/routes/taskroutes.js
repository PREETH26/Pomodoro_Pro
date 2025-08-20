const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskcontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

// Routes
router.post("/", protect, createTask);       // Create task
router.get("/", protect, getTasks);          // Get all tasks
router.put("/:id", protect, updateTask);     // Update task
router.delete("/:id", protect, deleteTask);  // Delete task

module.exports = router;
