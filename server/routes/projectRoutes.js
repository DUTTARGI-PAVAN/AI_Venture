const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const projectController = require("../controllers/projectController");

router.post("/", authMiddleware, projectController.createProject);

router.get("/", authMiddleware, projectController.getProjects);

router.get("/:id", authMiddleware, projectController.getProject);

router.put("/:id", authMiddleware, projectController.updateProject);

router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;