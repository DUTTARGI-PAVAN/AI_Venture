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

  // AI Validation
  aiScore: analysis?.aiScore || 0,
  validationSummary:
    analysis?.summary ||
    analysis?.rawResponse ||
    "No validation summary available.",

  // Boardroom
  boardroomScore: boardroom?.averageScore || 0,
  finalDecision: boardroom?.finalDecision || "Not Generated",

  executiveScores:
    boardroom?.agents?.map((agent) => ({
      role: agent.role,
      score: agent.score,
    })) || [],

  executiveOpinions:
    boardroom?.agents?.map((agent) => ({
      role: agent.role,
      opinion: agent.opinion,
      strengths: agent.strengths,
      concerns: agent.concerns,
      recommendations: agent.recommendations,
    })) || [],

  boardroomConsensus:
    boardroom?.consensus ||
    "Boardroom discussion has not been generated.",

  // Analysis
  strengths: analysis?.strengths || [],
  weaknesses: analysis?.weaknesses || [],
  risks: analysis?.risks || [],

  revenueModel:
    analysis?.revenueModel || "Not Available",

  suggestedMvp:
    analysis?.suggestedMvp || "Not Available",

  overallRecommendation:
    boardroom?.finalDecision === "INVEST"
      ? "Proceed with MVP development and customer validation."
      : "Improve the business model and address the highlighted concerns before moving forward.",
};
}

module.exports = {
  getAnalytics,
};