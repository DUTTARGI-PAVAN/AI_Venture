const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const aiController = require("../controllers/aiController");

router.get(
  "/projects/:projectId/analysis",
  authMiddleware,
  aiController.getLatestAnalysis
);

router.post(
  "/projects/:projectId/validate",
  authMiddleware,
  aiController.validateIdea
);

module.exports = router;
