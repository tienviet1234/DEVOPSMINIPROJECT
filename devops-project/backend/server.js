require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const APP_NAME = process.env.APP_NAME || "Task Manager";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const DB_URL = process.env.DB_URL || "mongodb://mongo:27017/taskmanager";
mongoose
  .connect(DB_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

// ─────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: APP_NAME, timestamp: new Date().toISOString() });
});

// About - Student Info
app.get("/about", (req, res) => {
  res.json({
    student: {
      name: process.env.STUDENT_NAME || "Nguyễn Văn A",
      studentId: process.env.STUDENT_ID || "21IT000001",
      class: process.env.STUDENT_CLASS || "CNTT21A",
    },
    app: APP_NAME,
    version: "1.0.0",
    description: "Task Manager Application - DevOps Mini Project",
  });
});

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tasks, total: tasks.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single task
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const task = new Task({ title, description, priority });
    await task.save();
    res.status(201).json({ success: true, data: task, message: "Task created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task, message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET stats
app.get("/api/stats", async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ completed: true });
    const pending = total - completed;
    const highPriority = await Task.countDocuments({ priority: "high", completed: false });
    res.json({ success: true, data: { total, completed, pending, highPriority } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ${APP_NAME} backend running on port ${PORT}`);
});
