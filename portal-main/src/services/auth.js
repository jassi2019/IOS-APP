import axiosInstance from "./axios";

export const login = async (email, password) => {
  const deviceName = navigator.userAgent;
  const deviceId = navigator.platform;

  const response = await axiosInstance.post(
    "/api/v1/auth/login",
    {
      email,
      password,
    },
    {
      headers: {
        "device-name": deviceName,
        "device-id": deviceId,
      },
    }
  );
  return response.data;
};

export const requestDeletion = async (email, password) => {
  const response = await axiosInstance.post("/api/v1/deletions/request", {
    email,
    password,
  });
  return response.data;
};
