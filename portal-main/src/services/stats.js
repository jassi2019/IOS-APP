import axiosInstance from "./axios";

export const getStats = async () => {
  const response = await axiosInstance.get("/api/v1/stats/admin/dashboard");
  return response.data;
};
