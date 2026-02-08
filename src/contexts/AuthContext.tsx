import { useGetProfile } from '@/hooks/api/user';
import tokenManager from '@/lib/tokenManager';
import { TUser } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const USER_KEY = '@auth_user';
const GUEST_KEY = '@auth_guest_mode';

type AuthContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isGuest: boolean;
  enterGuestMode: () => Promise<void>;
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
  const { refetch: fetchProfile } = useGetProfile({ enabled: false });

  const persistUser = async (userData: TUser | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        await AsyncStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
      } else {
        await AsyncStorage.removeItem(USER_KEY);
        await tokenManager.clearToken();
        await AsyncStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
      }
      setUser(userData);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const enterGuestMode = async () => {
    try {
      await tokenManager.clearToken();
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.setItem(GUEST_KEY, 'true');
      setUser(null);
      setIsGuest(true);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const guestMode = await AsyncStorage.getItem(GUEST_KEY);
        if (guestMode === 'true') {
          await tokenManager.loadToken();
          setIsGuest(true);
          setUser(null);
          return;
        }

        const token = await tokenManager.loadToken();
        if (!token) {
          setUser(null);
          return;
        }

        try {
          // Try to get fresh user data
          const profileResult = await fetchProfile();
          if (profileResult.data?.data) {
            await persistUser(profileResult.data.data);
          } else {
            // If profile fetch fails, clear everything
            await persistUser(null);
          }
        } catch (error) {
          await persistUser(null);
        }
      } catch (error) {
        await persistUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: persistUser,
        isGuest,
        enterGuestMode,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
