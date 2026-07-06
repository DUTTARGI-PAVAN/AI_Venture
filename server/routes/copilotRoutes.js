const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const copilotController = require("../controllers/copilotController");

router.post(
  "/:projectId/chat",
  authMiddleware,
  copilotController.chat
);

router.get(
  "/:projectId/chat",
  authMiddleware,
  copilotController.getChat
);

module.exports = router;

