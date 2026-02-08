import axiosInstance from "./axios";

export const getClasses = async () => {
  const response = await axiosInstance.get("/api/v1/classes");
  return response.data;
};

export const getClass = async (classId) => {
  const response = await axiosInstance.get(`/api/v1/classes/${classId}`);
  return response.data;
};

export const createClass = async (payload) => {
  const response = await axiosInstance.post("/api/v1/classes", payload);
  return response.data;
};

export const updateClass = async (classId, payload) => {
  const response = await axiosInstance.put(
    `/api/v1/classes/${classId}`,
    payload
  );
  return response.data;
};

export const deleteClass = async (classId) => {
  const response = await axiosInstance.delete(`/api/v1/classes/${classId}`);
  return response.data;
};
