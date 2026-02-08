import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

let authToken: string | null = null;

export const tokenManager = {
  setToken: async (token: string | null) => {
    authToken = token;
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  },
  getToken: () => authToken,
  loadToken: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    authToken = token;
    return token;
  },
  clearToken: async () => {
    authToken = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};

export default tokenManager;
