const { runAgent } = require("./baseAgent");

async function CMOAgent(project, analysis) {
  const systemPrompt = `
You are the Chief Marketing Officer.

Evaluate ONLY marketing.

Focus on:
- Branding
- Customer acquisition
- Market demand
- Competition
- Growth strategy

Return ONLY valid JSON.

{
  "role":"CMO",
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
${analysis.summary}

Strengths:
${analysis.strengths.join(", ")}

Weaknesses:
${analysis.weaknesses.join(", ")}

Evaluate as CMO only.
`;

  return await runAgent(systemPrompt, userPrompt);
}

module.exports = CMOAgent;