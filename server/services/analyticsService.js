const Project = require("../models/Project");
const Analysis = require("../models/Analysis");
const Boardroom = require("../models/Boardroom");

async function getAnalytics(projectId, userId) {
  const project = await Project.findOne({
    _id: projectId,
    user: userId,
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  const analysis = await Analysis.findOne({
    project: projectId,
    user: userId,
  }).sort({ createdAt: -1 });

  const boardroom = await Boardroom.findOne({
    project: projectId,
    user: userId,
  }).sort({ createdAt: -1 });

  return {
    project: {
      title: project.title,
      description: project.description,
      industry: project.industry,
      stage: project.stage,
    },

    aiScore: analysis?.aiScore || 0,

    boardroomScore: boardroom?.averageScore || 0,

    finalDecision: boardroom?.finalDecision || "Not Generated",

    executiveScores:
      boardroom?.agents.map((agent) => ({
        role: agent.role,
        score: agent.score,
      })) || [],

    strengths: analysis?.strengths || [],

    weaknesses: analysis?.weaknesses || [],

    risks: analysis?.risks || [],

    revenueModel:
      analysis?.revenueModel || "Not Available",

    suggestedMvp:
      analysis?.suggestedMvp || "Not Available",
  };
}

module.exports = {
  getAnalytics,
};