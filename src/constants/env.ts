import Constants from 'expo-constants';

type TEnv = {
  backendUrl: string;
  razorpayKeyId: string | null;
};

const DEFAULT_BACKEND_URL = 'https://api.taiyarineetki.com';
const DEFAULT_DEV_BACKEND_PORT = '8003';

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const parseUrlSafely = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const extractHostFromHostUri = (hostUri: string | null | undefined) => {
  if (!hostUri || typeof hostUri !== 'string') return null;
  const trimmed = hostUri.trim();
  if (!trimmed) return null;
  // hostUri commonly looks like: 192.168.1.10:8081
  return trimmed.split(':')[0] || null;
};

const isPrivateIPv4 = (host: string) => {
  const parts = host.split('.').map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  if (parts[0] === 10) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 127) return true;

  return false;
};

const isLocalOrPrivateHost = (host: string | null | undefined) => {
  if (!host) return false;
  const normalized = host.toLowerCase();
  if (normalized === 'localhost' || normalized === '0.0.0.0' || normalized === '::1') {
    return true;
  }
  if (normalized.endsWith('.local')) {
    return true;
  }
  return isPrivateIPv4(normalized);
};

const getExpoMetroHost = (): string | null => {
  try {
    const constants = (
      ((Constants as unknown as { default?: unknown }).default ?? Constants) as {
        expoGoConfig?: { debuggerHost?: string; hostUri?: string };
        expoConfig?: { hostUri?: string };
        manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
        manifest?: { debuggerHost?: string; hostUri?: string };
      }
    );
    const manifestHostCandidates = [
      constants?.expoGoConfig?.debuggerHost,
      constants?.expoGoConfig?.hostUri,
      constants?.expoConfig?.hostUri,
      constants?.manifest2?.extra?.expoClient?.hostUri,
      constants?.manifest?.debuggerHost,
      constants?.manifest?.hostUri,
    ];

    for (const candidate of manifestHostCandidates) {
      const host = extractHostFromHostUri(candidate);
      if (host) return host;
    }
  } catch {
    // noop
  }
  return null;
};

const resolveBackendUrl = () => {
  const configuredRaw = (process.env.EXPO_PUBLIC_BACKEND_URL || '').trim();
  const configured = configuredRaw ? parseUrlSafely(configuredRaw) : null;
  const metroHost = __DEV__ ? getExpoMetroHost() : null;

  if (configuredRaw) {
    return normalizeBaseUrl(configuredRaw);
  }

  // No explicit env URL: in dev, infer LAN backend from Metro host.
  if (__DEV__ && metroHost) {
    const portFromEnv = configured?.port || DEFAULT_DEV_BACKEND_PORT;
    const protocol =
      configured && !isLocalOrPrivateHost(configured.hostname) && configured.protocol === 'https:'
        ? 'https'
        : 'http';
    return normalizeBaseUrl(`${protocol}://${metroHost}:${portFromEnv}`);
  }

  return normalizeBaseUrl(DEFAULT_BACKEND_URL);
};

const env: TEnv = {
  backendUrl: resolveBackendUrl(),
  // Android-only (Razorpay). Safe to ship as EXPO_PUBLIC_* since this is not a secret.
  razorpayKeyId: (process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '').trim() || null,
};

export default env;
