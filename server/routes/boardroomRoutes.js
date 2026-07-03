const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const boardroomController = require("../controllers/boardroomController");

router.get("/test", (req, res) => {
  res.json({ message: "Boardroom route works" });
});

router.post(
  "/:projectId",
  authMiddleware,
  boardroomController.runBoardroom
);

router.get(
  "/:id",
  authMiddleware,
  boardroomController.getBoardroom
);

module.exports = router;