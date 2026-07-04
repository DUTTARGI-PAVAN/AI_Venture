import api from "./api";

export async function runBoardroom(projectId) {

  const { data } = await api.post(
    `/boardroom/${projectId}`
  );

  return data;
}

export async function getBoardroom(projectId) {

  const { data } = await api.get(
    `/boardroom/${projectId}`
  );

  return data;
}