const { askCopilot } = require("../services/copilotService");

exports.chat = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await askCopilot(
      projectId,
      req.user.id,
      question
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const Chat = require("../models/Chat");

exports.getChat = async (req, res) => {
  try {
    const { projectId } = req.params;

    const chat = await Chat.findOne({
      project: projectId,
      user: req.user.id,
    });

    res.json({
      success: true,
      messages: chat?.messages || [],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};