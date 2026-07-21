const Project = require("../models/Project");
const Analysis = require("../models/Analysis");
const Boardroom = require("../models/Boardroom");

const { runBoardroom } = require("../services/boardroomService");

exports.runBoardroom = async (req, res) => {
  console.log("✅ runBoardroom called");
  try {
    
    const { projectId } = req.params;
    console.log("Project ID:", projectId);
console.log("Logged-in User:", req.user.id);

    const project = await Project.findById(projectId).populate("latestAnalysis");

console.log("Project:", project);

if (project) {
  console.log("Project owner:", project.user.toString());
  console.log("Logged in user:", req.user.id);
}

    console.log("Project:", project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const analysis = project.latestAnalysis;

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Please validate the idea before running the AI Boardroom.",
      });
    }

    const boardroom = await runBoardroom(
      project,
      analysis,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Boardroom discussion generated successfully.",
      boardroom,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBoardroom = async (req, res) => {
  try {
    const boardroom = await Boardroom.findById(req.params.id)
      .populate("project")
      .populate("analysis");

    if (!boardroom) {
      return res.status(404).json({
        success: false,
        message: "Boardroom report not found",
      });
    }

    return res.status(200).json({
      success: true,
      boardroom,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};