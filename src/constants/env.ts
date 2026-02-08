type TEnv = {
  backendUrl: string;
};

const env: TEnv = {
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || "",
};

export default env;
