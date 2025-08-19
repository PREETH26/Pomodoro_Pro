import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskcontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Routes
router.post("/", protect, createTask);       // Create task
router.get("/", protect, getTasks);          // Get all tasks
router.put("/:id", protect, updateTask);     // Update task
router.delete("/:id", protect, deleteTask);  // Delete task

export default router;
