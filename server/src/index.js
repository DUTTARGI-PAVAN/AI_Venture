require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("../config/database");
const authRoutes = require("../routes/authRoutes");
const projectRoutes = require("../routes/projectRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
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