const Analysis = require("../models/Analysis");
const Project = require("../models/Project");
const { generateStartupValidation } = require("../services/aiService");

async function findUserProject(projectId, userId) {
  return Project.findOne({
    _id: projectId,
    user: userId,
  }).populate("latestAnalysis");
}

exports.getLatestAnalysis = async (req, res) => {
  try {
    const project = await findUserProject(req.params.projectId, req.user.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const analysis =
      project.latestAnalysis ||
      (await Analysis.findOne({
        project: project._id,
        user: req.user.id,
      }).sort({ createdAt: -1 }));

    res.json({
      success: true,
      analysis,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.validateIdea = async (req, res) => {
  try {
    const { forceRegenerate = false } = req.body;
    const project = await findUserProject(req.params.projectId, req.user.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!forceRegenerate && project.latestAnalysis) {
      return res.json({
        success: true,
        cached: true,
        analysis: project.latestAnalysis,
      });
    }

    const aiResult = await generateStartupValidation(project);

    const analysis = await Analysis.create({
      project: project._id,
      user: req.user.id,
      ...aiResult,
    });

    project.latestAnalysis = analysis._id;
    await project.save();

    res.status(201).json({
      success: true,
      cached: false,
      analysis,
    });
  } catch (err) {
    console.error(err);

    res.status(502).json({
      success: false,
      message:
        err.message ||
        "Unable to generate the AI validation report. Please try again.",
    });
  }
};
