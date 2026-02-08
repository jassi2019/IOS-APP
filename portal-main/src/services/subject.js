import axiosInstance from "./axios";

export const getSubjects = async () => {
  const response = await axiosInstance.get("/api/v1/subjects");
  return response.data;
};

export const getSubject = async (subjectId) => {
  const response = await axiosInstance.get(`/api/v1/subjects/${subjectId}`);
  return response.data;
};

export const createSubject = async (payload) => {
  const response = await axiosInstance.post("/api/v1/subjects", payload);
  return response.data;
};

export const updateSubject = async (subjectId, payload) => {
  const response = await axiosInstance.put(
    `/api/v1/subjects/${subjectId}`,
    payload
  );
  return response.data;
};

export const deleteSubject = async (subjectId) => {
  const response = await axiosInstance.delete(`/api/v1/subjects/${subjectId}`);
  return response.data;
};
