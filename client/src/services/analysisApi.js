import api from "./api";

export async function getLatestAnalysis(projectId) {
  const { data } = await api.get(`/ai/projects/${projectId}/analysis`);
  return data.analysis;
}

export async function validateIdea(projectId, forceRegenerate = false) {
  const { data } = await api.post(`/ai/projects/${projectId}/validate`, {
    forceRegenerate,
  });

  return data.analysis;
}
