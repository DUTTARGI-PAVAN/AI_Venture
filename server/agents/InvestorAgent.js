const { runAgent } = require("./baseAgent");

async function InvestorAgent(project, analysis) {
  const systemPrompt = `
You are a Venture Capital investor.

Evaluate whether you would invest.

Focus on:
- Market opportunity
- Team potential
- Risk
- ROI
- Exit opportunities

Return ONLY JSON.

{
  "role":"Investor",
  "score":0,
  "opinion":"",
  "strengths":[],
  "concerns":[],
  "recommendations":[]
}
`;

  const userPrompt = `
Startup

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

AI Score:
${analysis.aiScore}

Risks:
${analysis.risks.join(", ")}

Revenue:
${analysis.revenueModel}

Evaluate only as an investor.
`;

  return await runAgent(systemPrompt, userPrompt);
}

module.exports = InvestorAgent;