const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    model: {
      type: String,
      required: true,
    },

    startupSummary: {
      type: String,
      required: true,
    },

    problemStatement: {
      type: String,
      required: true,
    },

    targetAudience: {
      type: String,
      required: true,
    },

    marketOpportunity: {
      type: String,
      required: true,
    },

    competitorAnalysis: {
      type: String,
      required: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    risks: {
      type: [String],
      default: [],
    },

    suggestedMvp: {
      type: String,
      required: true,
    },

    revenueModel: {
      type: String,
      required: true,
    },

    aiScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    rawResponse: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model("Analysis", analysisSchema);
