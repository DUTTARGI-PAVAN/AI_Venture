const { runAgent } = require("./baseAgent");

async function CTOAgent(project, analysis) {
  const systemPrompt = `
You are the CTO of a startup.

Evaluate ONLY from a technology perspective.

Focus on:
- Technical feasibility
- Architecture
- Scalability
- Security
- Development complexity

Return ONLY valid JSON:

{
  "role":"CTO",
  "score":0,
  "opinion":"",
  "strengths":[],
  "concerns":[],
  "recommendations":[]
}
`;

  const userPrompt = `
Project

Title: ${project.title}

Description:
${project.description}

Industry:
${project.industry}

Stage:
${project.stage}

AI Summary:
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

Evaluate this startup only as CTO.
`;

  return await runAgent(systemPrompt, userPrompt);
}

module.exports = CTOAgent;