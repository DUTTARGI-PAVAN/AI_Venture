const { runAgent } = require("./baseAgent");

async function CFOAgent(project, analysis) {
  const systemPrompt = `
You are the CFO of a startup.

Evaluate ONLY from a financial perspective.

Focus on:
- Revenue
- Costs
- Burn rate
- Profitability
- Financial risks

Return ONLY valid JSON:

{
  "role":"CFO",
  "score":0,
  "opinion":"",
  "strengths":[],
  "concerns":[],
  "recommendations":[]
}
`;

  const userPrompt = `
Title:
${project.title}

Description:
${project.description}

Industry:
${project.industry}

Stage:
${project.stage}

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

Revenue Model:
${analysis.revenueModel}

Risks:
${analysis.risks.join(", ")}

Evaluate as CFO only.
`;

  return await runAgent(systemPrompt, userPrompt);
}

module.exports = CFOAgent;