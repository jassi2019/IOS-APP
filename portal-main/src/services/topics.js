import axiosInstance from "./axios";

export const getTopics = async () => {
  const response = await axiosInstance.get("/api/v1/topics");
  return response.data;
};

export const getTopic = async (topicId) => {
  const response = await axiosInstance.get(`/api/v1/topics/${topicId}`);
  return response.data;
};

export const createTopic = async (payload) => {
  const response = await axiosInstance.post("/api/v1/topics", payload);
  return response.data;
};

export const updateTopic = async (topicId, payload) => {
  const response = await axiosInstance.put(
    `/api/v1/topics/${topicId}`,
    payload
  );
  return response.data;
};

export const deleteTopic = async (topicId) => {
  const response = await axiosInstance.delete(`/api/v1/topics/${topicId}`);
  return response.data;
};
