import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import AskForEmail from '../screens/auth/ForgotPassword/AskForEmail';
import OTPVerification from '../screens/auth/ForgotPassword/OTPVerification';
import ResetPassword from '../screens/auth/ForgotPassword/ResetPassword';
import Landing from '../screens/auth/Landing/Landing';
import Login from '../screens/auth/Login/Login';
import RegisterOTPVerification from '../screens/auth/Register/RegisterOTPVerification';
import SetAccountPassword from '../screens/auth/Register/SetAccountPassword';
import SetEmail from '../screens/auth/Register/SetEmail';

// Main Screens
import Chapters from '../screens/main/Chapters';
import Home from '../screens/main/Home';
import Payment from '../screens/main/Payment';
import Plans from '../screens/main/Plans';
import Privacy from '../screens/main/Privacy';
import Profile from '../screens/main/Profile';
import Subjects from '../screens/main/Subjects';
import SubscriptionMessage from '../screens/main/SubscriptionMessage';
import TermsAndConditions from '../screens/main/TermsAndConditions';
import TopicContent from '../screens/main/TopicContent';
import Topics from '../screens/main/Topics';
import NotFoundScreen from '../screens/NotFoundScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string; size: number }) => {
            const Home = require('lucide-react-native').Home;
            return <Home size={28} color={color} strokeWidth={color === '#000000' ? 2 : 1.5} />;
          },
        }}
      />
      <Tab.Screen
        name="SubjectsTab"
        component={Subjects}
        options={{
          title: 'Subjects',
          tabBarIcon: ({ color }: { color: string; size: number }) => {
            const Notebook = require('lucide-react-native').Notebook;
            return <Notebook size={28} color={color} strokeWidth={color === '#000000' ? 2 : 1.5} />;
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string; size: number }) => {
            const User = require('lucide-react-native').User;
            return <User size={28} color={color} strokeWidth={color === '#000000' ? 2 : 1.5} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SetEmail" component={SetEmail} />
      <Stack.Screen name="RegisterOTPVerification" component={RegisterOTPVerification} />
      <Stack.Screen name="SetAccountPassword" component={SetAccountPassword} />
      <Stack.Screen name="AskForEmail" component={AskForEmail} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Chapters" component={Chapters} />
      <Stack.Screen name="Topics" component={Topics} />
      <Stack.Screen name="TopicContent" component={TopicContent} />
      <Stack.Screen name="Plans" component={Plans} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="SubscriptionMessage" component={SubscriptionMessage} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, isGuest, isLoading } = useAuth();

  // MOCK MODE: Set to true to bypass authentication and see main content
  // Set to false when backend is ready
  // NOTE: Main screens use Tailwind classes and need styling fixes before mock mode can work
  const MOCK_AUTH_MODE = false;

  console.log('🔄 RootNavigator - isLoading:', isLoading, 'user:', user ? 'EXISTS' : 'NULL');

  if (isLoading) {
    console.log('⏳ Showing loading screen...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F1BB3E" />
      </View>
    );
  }

  // In mock mode, always show main stack to test UI without backend
  if (MOCK_AUTH_MODE) {
    console.log('🧪 Mock mode enabled - showing MainStack');
    return <MainStack />;
  }

  if (user || isGuest) {
    console.log('✅ User authenticated or guest - showing MainStack');
    return <MainStack />;
  }

  console.log('🔐 No user - showing AuthStack');
  return <AuthStack />;
}
