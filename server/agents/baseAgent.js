const axios = require("axios");

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL || "llama3.2:latest";

function extractJSON(text) {
  if (!text) {
    throw new Error("Empty response received from Ollama.");
  }

  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned by Ollama.");
    }

    return JSON.parse(trimmed.substring(start, end + 1));
  }
}

function normalizeArray(value) {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    if (typeof item === "string") return item;

    if (item && typeof item === "object") {
      return item.value || item.name || JSON.stringify(item);
    }

    return String(item);
  });
}

function normalizeAgentResponse(data) {
  return {
    role: data.role || "AI Agent",
    score: Math.max(0, Math.min(100, Number(data.score) || 0)),
    opinion:
  typeof data.opinion === "string" && data.opinion.trim().length > 0
    ? data.opinion.trim()
    : "No opinion provided.",

    strengths: normalizeArray(data.strengths),
    concerns: normalizeArray(data.concerns),
    recommendations: normalizeArray(data.recommendations),
  };
}

async function runAgent(systemPrompt, userPrompt) {
  try {
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        stream: false,
        format: "json",
        prompt: `
${systemPrompt}

${userPrompt}
`,
        options: {
          temperature: 0.4,
        },
      },
      {
        timeout: 120000,
      }
    );

    const parsed = extractJSON(response.data.response);

const normalized = normalizeAgentResponse(parsed);

console.log("Normalized Agent:", normalized);

return normalized;
  } catch (err) {
    throw new Error(
      err?.response?.data?.error ||
        err.message ||
        "Failed to execute AI agent."
    );
  }
}

async function runChat(systemPrompt, userPrompt) {
  const response = await axios.post(
    `${OLLAMA_BASE_URL}/api/generate`,
    {
      model: OLLAMA_MODEL,
      stream: false,
      prompt: `
${systemPrompt}

${userPrompt}
      `,
      options: {
        temperature: 0.7,
      },
    },
    {
      timeout: 120000,
    }
  );

  return response.data.response.trim();
}

module.exports = {
  runAgent,
  runChat,
};

