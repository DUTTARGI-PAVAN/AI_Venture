const Chat = require("../models/Chat");
const Project = require("../models/Project");
const Analysis = require("../models/Analysis");
const Boardroom = require("../models/Boardroom");
const { runAgent } = require("../agents/baseAgent");

async function askCopilot(projectId, userId, question) {

    const project = await Project.findOne({
        _id: projectId,
        user: userId
    });

    if (!project) {
        throw new Error("Project not found.");
    }

    const analysis = await Analysis.findOne({
        project: projectId,
        user: userId
    }).sort({ createdAt: -1 });

    const boardroom = await Boardroom.findOne({
        project: projectId,
        user: userId
    }).sort({ createdAt: -1 });

    let chat = await Chat.findOne({
        project: projectId,
        user: userId
    });

    if (!chat) {
        chat = await Chat.create({
            project: projectId,
            user: userId,
            messages: []
        });
    }

    const history = chat.messages
        .map(
            m =>
                `${m.role.toUpperCase()}: ${m.content}`
        )
        .join("\n");

    const systemPrompt = `
You are an AI Startup Copilot.

Help the founder build a successful startup.

Use the project details,
startup validation,
boardroom discussion,
and previous conversation.

Answer like an experienced startup mentor.

Keep answers practical.

Never invent information.
`;

    const userPrompt = `
PROJECT

Title:
${project.title}

Description:
${project.description}

Industry:
${project.industry}

Stage:
${project.stage}

VALIDATION

${analysis ? analysis.rawResponse : "Not available"}

BOARDROOM

${boardroom ? boardroom.consensus : "Not available"}

CHAT HISTORY

${history}

USER QUESTION

${question}
`;

    const ai = await runAgent(
        systemPrompt,
        userPrompt
    );

    const answer =
        ai.answer ||
        ai.response ||
        ai.opinion ||
        JSON.stringify(ai);

    chat.messages.push({
        role: "user",
        content: question
    });

    chat.messages.push({
        role: "assistant",
        content: answer
    });

    await chat.save();

    return {
        answer,
        messages: chat.messages
    };
}

module.exports = {
    askCopilot
};