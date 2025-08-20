const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskcontroller");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// Routes
router.post("/", authMiddleware, createTask);       // Create task
router.get("/", authMiddleware, getTasks);          // Get all tasks
router.put("/:id", authMiddleware, updateTask);     // Update task
router.delete("/:id", authMiddleware, deleteTask);  // Delete task

module.exports = router;
