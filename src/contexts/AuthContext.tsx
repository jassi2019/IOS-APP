import api from '@/lib/api';
import tokenManager from '@/lib/tokenManager';
import { TUser } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const USER_KEY = '@auth_user';
const GUEST_KEY = '@auth_guest_mode';
const BOOT_PROFILE_TIMEOUT_MS = 7000;

type AuthContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isGuest: boolean;
  hasSession: boolean;
  enterGuestMode: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const appState = useRef(AppState.currentState);

  const parseCachedUser = (raw: string | null): TUser | null => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as TUser;
    } catch {
      return null;
    }
  };

  const getErrorStatus = (error: any): number | null => {
    return (
      error?.statusCode ||
      error?.status ||
      error?.response?.status ||
      error?.details?.statusCode ||
      null
    );
  };

  const persistUser = async (userData: TUser | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        await AsyncStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
        setHasSession(true);
      } else {
        await AsyncStorage.removeItem(USER_KEY);
        await tokenManager.clearToken();
        await AsyncStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
        setHasSession(false);
      }
      setUser(userData);
    } catch (_error) {
      // silent
    }
  };

  const enterGuestMode = async () => {
    try {
      await tokenManager.clearToken();
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.setItem(GUEST_KEY, 'true');
      setUser(null);
      setIsGuest(true);
      setHasSession(false);
    } catch (_error) {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = tokenManager.subscribe((token) => {
      const active = !!token;
      setHasSession(active);
      if (!active) {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const [guestMode, cachedUserRaw] = await Promise.all([
          AsyncStorage.getItem(GUEST_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        const cachedUser = parseCachedUser(cachedUserRaw);

        if (guestMode === 'true') {
          await tokenManager.clearToken();
          setIsGuest(true);
          setUser(null);
          setHasSession(false);
          setIsLoading(false);
          return;
        }

        const token = await tokenManager.loadToken();
        if (!token) {
          await AsyncStorage.removeItem(USER_KEY);
          setIsGuest(false);
          setUser(null);
          setHasSession(false);
          setIsLoading(false);
          return;
        }

        // Render immediately from cache (or auth shell) and refresh profile in background.
        setIsGuest(false);
        setHasSession(true);
        setUser(cachedUser);
        setIsLoading(false);

        try {
          const profileResult: any = await api.get('/api/v1/users/me', {
            timeout: BOOT_PROFILE_TIMEOUT_MS,
            skipRetry: true,
            suppressErrorLogging: true,
          } as any);

          const freshUser = profileResult?.data || null;
          if (freshUser) {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(freshUser));
            setIsGuest(false);
            setUser(freshUser);
          }
        } catch (error) {
          const status = getErrorStatus(error);
          // Clear auth only for definitely invalid sessions.
          if (status === 401 || status === 403) {
            await persistUser(null);
          }
          // For network/timeout errors, keep cached session state and do not block UI.
        }
      } catch (error) {
        await persistUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Re-validate session when app comes to foreground (single device login enforcement)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        const token = await tokenManager.loadToken();
        if (!token) return;
        try {
          const profileResult: any = await api.get('/api/v1/users/me', {
            timeout: BOOT_PROFILE_TIMEOUT_MS,
            skipRetry: true,
            suppressErrorLogging: true,
          } as any);
          const freshUser = profileResult?.data || null;
          if (freshUser) {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(freshUser));
            setUser(freshUser);
          }
        } catch (error) {
          const status = getErrorStatus(error);
          if (status === 401 || status === 403) {
            await persistUser(null);
          }
        }
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  const signOut = async () => {
    await tokenManager.clearToken();
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(GUEST_KEY);
    setUser(null);
    setIsGuest(false);
    setHasSession(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: persistUser,
        isGuest,
        hasSession,
        enterGuestMode,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
