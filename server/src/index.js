require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("../config/database");
const authRoutes = require("../routes/authRoutes");
const projectRoutes = require("../routes/projectRoutes");
const aiRoutes = require("../routes/aiRoutes");
const analyticsRoutes = require("../routes/analyticsRoutes");
const boardroomRoutes = require("../routes/boardroomRoutes");
const copilotRoutes = require("../routes/copilotRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/boardroom", boardroomRoutes);
app.use("/api/copilot", copilotRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        ok: true,
        service: "AI Venture Studio API",
        model: process.env.OLLAMA_MODEL
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const Project = require("../models/Project");

app.get("/api/debug/projects", async (req, res) => {
  try {
    const projects = await Project.find().select("_id title user");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authMiddleware = require("../middleware/authMiddleware");

app.get("/api/debug/me", authMiddleware, (req, res) => {
  res.json(req.user);
});