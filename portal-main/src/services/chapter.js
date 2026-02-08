import axiosInstance from "./axios";

export const getChapters = async () => {
  const response = await axiosInstance.get("/api/v1/chapters");
  return response.data;
};

export const getChapter = async (chapterId) => {
  const response = await axiosInstance.get(`/api/v1/chapters/${chapterId}`);
  return response.data;
};

export const createChapter = async (payload) => {
  const response = await axiosInstance.post("/api/v1/chapters", payload);
  return response.data;
};

export const updateChapter = async (chapterId, payload) => {
  const response = await axiosInstance.put(
    `/api/v1/chapters/${chapterId}`,
    payload
  );
  return response.data;
};

export const deleteChapter = async (chapterId) => {
  const response = await axiosInstance.delete(`/api/v1/chapters/${chapterId}`);
  return response.data;
};
