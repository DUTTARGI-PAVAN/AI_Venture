import api from "./api";

export async function getChat(projectId) {
  const { data } = await api.get(
    `/copilot/${projectId}/chat`
  );

  return data;
}

export async function sendMessage(projectId, question) {
  const { data } = await api.post(
    `/copilot/${projectId}/chat`,
    {
      question,
    }
  );

  return data;
}