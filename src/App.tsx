import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { BottomNavProvider } from './components/BottomNavBar/BottomNavBar';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import { AuthProvider } from './contexts/AuthContext';
import { FeatureProvider } from './contexts/FeatureContext';
import { useContentProtection } from './hooks/useContentProtection';
import RootNavigator from './navigation/RootNavigator';

enableScreens();

const queryClient = new QueryClient();

// App-wide screenshot/recording block. Stays active for the entire app lifetime
// so every screen is covered, not just Home/TopicContent.
function AppShell() {
  useContentProtection({ key: 'app-global', appSwitcherBlurIntensity: 0.7 });
  return <RootNavigator />;
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FeatureProvider>
            <BottomNavProvider>
              <SafeAreaProvider>
                <NavigationContainer>
                  <AppShell />
                  <StatusBar style="auto" />
                </NavigationContainer>
              </SafeAreaProvider>
            </BottomNavProvider>
          </FeatureProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
