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
  } catch (err) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end ===-1) {
      throw new Error("Invalid JSON returned by Ollama.");
    }

    return JSON.parse(trimmed.substring(start, end + 1));
  }
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

    return extractJSON(response.data.response);
  } catch (err) {
    throw new Error(
      err?.response?.data?.error ||
      err.message ||
      "Failed to execute AI agent."
    );
  }
}

module.exports = {
  runAgent,
};