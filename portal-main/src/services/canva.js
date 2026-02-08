import axiosInstance from "./axios";

export const getDesigns = async (query) => {
  const response = await axiosInstance.get("/api/v1/canva/designs", {
    params: {
      query,
    },
  });
  return response.data;
};
