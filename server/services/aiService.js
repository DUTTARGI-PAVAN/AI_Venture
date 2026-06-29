const axios = require("axios");
const { buildStartupValidationPrompt } = require("./prompts/startupValidationPrompt");

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

function extractJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Ollama returned an empty response.");
  }

  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch (err) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Ollama response did not contain valid JSON.");
    }

    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function normalizeString(value, fallback) {
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeScore(value) {
  const score = Number.parseInt(value, 10);

  if (Number.isNaN(score)) return 0;

  return Math.min(100, Math.max(0, score));
}

function normalizeAnalysisPayload(payload) {
  return {
    startupSummary: normalizeString(
      payload.startupSummary,
      "The AI could not produce a startup summary."
    ),
    problemStatement: normalizeString(
      payload.problemStatement,
      "The AI could not identify a clear problem statement."
    ),
    targetAudience: normalizeString(
      payload.targetAudience,
      "The AI could not identify a clear target audience."
    ),
    marketOpportunity: normalizeString(
      payload.marketOpportunity,
      "The AI could not estimate the market opportunity."
    ),
    competitorAnalysis: normalizeString(
      payload.competitorAnalysis,
      "The AI could not produce competitor analysis."
    ),
    strengths: normalizeStringArray(payload.strengths),
    weaknesses: normalizeStringArray(payload.weaknesses),
    risks: normalizeStringArray(payload.risks),
    suggestedMvp: normalizeString(
      payload.suggestedMvp,
      "The AI could not suggest an MVP."
    ),
    revenueModel: normalizeString(
      payload.revenueModel,
      "The AI could not recommend a revenue model."
    ),
    aiScore: normalizeScore(payload.aiScore),
  };
}

async function generateStartupValidation(project) {
  const prompt = buildStartupValidationPrompt(project);

  try {
    const { data } = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.3,
        },
      },
      {
        timeout: 120000,
      }
    );

    const rawResponse = data?.response || "";
    const parsed = extractJson(rawResponse);

    return {
      ...normalizeAnalysisPayload(parsed),
      model: OLLAMA_MODEL,
      rawResponse,
    };
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      throw new Error(
        "Unable to connect to Ollama. Start Ollama locally and try again."
      );
    }

    if (err.code === "ECONNABORTED") {
      throw new Error("Ollama took too long to generate the analysis.");
    }

    throw new Error(
      err?.response?.data?.error ||
        err.message ||
        "Ollama failed to generate the analysis."
    );
  }
}

module.exports = {
  generateStartupValidation,
};
