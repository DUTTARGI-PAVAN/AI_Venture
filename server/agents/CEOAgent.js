const { runAgent } = require("./baseAgent");

async function CEOAgent(project, analysis) {
  const systemPrompt = `
You are the CEO of a startup evaluating a business idea.

Your responsibilities are:
- Evaluate the business vision
- Evaluate product-market fit
- Evaluate customer value
- Evaluate scalability
- Evaluate long-term business potential

Respond ONLY in valid JSON.

Return exactly this structure:

{
  "role":"CEO",
  "score":0,
  "opinion":"",
  "strengths":[],
  "concerns":[],
  "recommendations":[]
}
`;

  const userPrompt = `
Startup Project

Title:
${project.title}

Description:
${project.description}

Industry:
${project.industry}

Stage:
${project.stage}

Existing AI Analysis

Summary:
${analysis.startupSummary}

Problem Statement:
${analysis.problemStatement}

Target Audience:
${analysis.targetAudience}

Market Opportunity:
${analysis.marketOpportunity}

Competitor Analysis:
${analysis.competitorAnalysis}

Strengths:
${analysis.strengths.join(", ")}

Weaknesses:
${analysis.weaknesses.join(", ")}

Risks:
${analysis.risks.join(", ")}

Suggested MVP:
${analysis.suggestedMvp}

Revenue Model:
${analysis.revenueModel}

AI Score:
${analysis.aiScore}

Evaluate this startup ONLY as a CEO.
`;

  return await runAgent(systemPrompt, userPrompt);
}

module.exports = CEOAgent;