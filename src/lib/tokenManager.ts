import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

let authToken: string | null = null;
const tokenListeners = new Set<(token: string | null) => void>();

const notifyTokenListeners = (token: string | null) => {
  tokenListeners.forEach((listener) => {
    try {
      listener(token);
    } catch {
      // noop
    }
  });
};

export const tokenManager = {
  setToken: async (token: string | null) => {
    authToken = token;
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
    notifyTokenListeners(authToken);
  },
  getToken: () => authToken,
  loadToken: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    authToken = token;
    notifyTokenListeners(authToken);
    return token;
  },
  clearToken: async () => {
    authToken = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
    notifyTokenListeners(authToken);
  },
  subscribe: (listener: (token: string | null) => void) => {
    tokenListeners.add(listener);
    return () => {
      tokenListeners.delete(listener);
    };
  },
};

export default tokenManager;
