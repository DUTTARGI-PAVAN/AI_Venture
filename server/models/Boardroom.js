const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

    opinion: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    strengths: [String],

    concerns: [String],

    recommendations: [String],
  },
  { _id: false }
);

const boardroomSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    analysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
      required: true,
    },

    agents: [agentSchema],

    consensus: {
      type: String,
      default: "",
    },

    finalDecision: {
      type: String,
      enum: ["Proceed", "Pivot", "Reject"],
      default: "Proceed",
    },

    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Boardroom", boardroomSchema);