type TEnv = {
  backendUrl: string;
};

const DEFAULT_BACKEND_URL = 'https://api.taiyarineetki.com';

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const env: TEnv = {
  // If EXPO_PUBLIC_BACKEND_URL is missing (common in misconfigured builds),
  // fall back to the production API instead of making relative requests that
  // fail with opaque "Network Error" on device.
  backendUrl: normalizeBaseUrl((process.env.EXPO_PUBLIC_BACKEND_URL || '').trim() || DEFAULT_BACKEND_URL),
};

export default env;
