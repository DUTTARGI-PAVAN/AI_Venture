const Boardroom = require("../models/Boardroom");

const CEOAgent = require("../agents/CEOAgent");
const CTOAgent = require("../agents/CTOAgent");
const CFOAgent = require("../agents/CFOAgent");
const CMOAgent = require("../agents/CMOAgent");
const InvestorAgent = require("../agents/InvestorAgent");

console.log("CEO:", typeof CEOAgent);
console.log("CTO:", typeof CTOAgent);
console.log("CFO:", typeof CFOAgent);
console.log("CMO:", typeof CMOAgent);
console.log("Investor:", typeof InvestorAgent);

function calculateAverageScore(agentResponses) {
  if (!agentResponses.length) return 0;

  const total = agentResponses.reduce(
    (sum, agent) => sum + Number(agent.score || 0),
    0
  );

  return Math.round(total / agentResponses.length);
}

function generateConsensus(agentResponses) {
  const positives = [];
  const concerns = [];

  agentResponses.forEach((agent) => {
    positives.push(...(agent.strengths || []));
    concerns.push(...(agent.concerns || []));
  });

  const uniqueStrengths = [...new Set(positives)];
  const uniqueConcerns = [...new Set(concerns)];

  return `
The board believes this startup has ${uniqueStrengths.length} major strengths
and ${uniqueConcerns.length} major concerns.

Top strengths:
${uniqueStrengths.slice(0, 5).join(", ")}

Top concerns:
${uniqueConcerns.slice(0, 5).join(", ")}
`;
}

function finalDecision(score) {
  if (score >= 80) return "Proceed";

  if (score >= 60) return "Pivot";

  return "Reject";
}

async function runBoardroom(project, analysis, userId) {
  console.log("Running CEO...");
const ceo = await CEOAgent(project, analysis);
console.log("CEO finished");

console.log("Running CTO...");
const cto = await CTOAgent(project, analysis);
console.log("CTO finished");

console.log("Running CFO...");
const cfo = await CFOAgent(project, analysis);
console.log("CFO finished");

console.log("Running CMO...");
const cmo = await CMOAgent(project, analysis);
console.log("CMO finished");

console.log("Running Investor...");
const investor = await InvestorAgent(project, analysis);
console.log("Investor finished");

const agents = [ceo, cto, cfo, cmo, investor];

  const averageScore = calculateAverageScore(agents);

  const consensus = generateConsensus(agents);

  const decision = finalDecision(averageScore);

  const boardroom = await Boardroom.create({
    user: userId,
    project: project._id,
    analysis: analysis._id,
    agents,
    averageScore,
    consensus,
    finalDecision: decision,
  });

  return boardroom;
}

module.exports = {
  runBoardroom,
};