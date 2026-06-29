function buildStartupValidationPrompt(project) {
  return `
You are an expert startup analyst, venture studio partner, and product strategist.

Analyze this startup idea with practical, investor-aware feedback.

Startup idea:
- Title: ${project.title || "Untitled"}
- Description: ${project.description || "No description provided"}
- Industry: ${project.industry || "Not specified"}
- Stage: ${project.stage || "Idea"}

Return only valid JSON. Do not include markdown, comments, or extra text.

Use this exact JSON shape:
{
  "startupSummary": "2-4 sentence summary of the startup idea.",
  "problemStatement": "Clear description of the customer problem.",
  "targetAudience": "Specific primary users and buyers.",
  "marketOpportunity": "Practical market opportunity and demand signals.",
  "competitorAnalysis": "Likely direct and indirect competitors, plus differentiation.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "risks": ["risk 1", "risk 2", "risk 3"],
  "suggestedMvp": "Lean MVP scope that can validate the riskiest assumptions.",
  "revenueModel": "Recommended monetization model and why it fits.",
  "aiScore": 0
}

Rules:
- aiScore must be an integer from 0 to 100.
- Keep each array to 3-5 items.
- Be specific and actionable.
- If information is missing, state a reasonable assumption inside the relevant field.
`;
}

module.exports = {
  buildStartupValidationPrompt,
};
