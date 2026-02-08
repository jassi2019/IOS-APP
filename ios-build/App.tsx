import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Home as HomeIcon, Notebook, User } from 'lucide-react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { usePreventScreenCapture } from 'expo-screen-capture';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Fallback from './screens/error/Fallback';
import './styles/global.css';

// ================= AUTH SCREENS =================
import AskForEmail from './screens/auth/ForgotPassword/AskForEmail';
import OTPVerification from './screens/auth/ForgotPassword/OTPVerification';
import Landing from './screens/auth/Landing/Landing';
import { Login } from './screens/auth/Login/Login';
import SetAccountPassword from './screens/auth/Register/SetAccountPassword';
import SetEmail from './screens/auth/Register/SetEmail';
import { ResetPassword } from './screens/auth/ForgotPassword/ResetPassword';
import { RegisterOTPVerification } from './screens/auth/Register/RegisterOTPVerification';

// ================= MAIN SCREENS =================
import Chapters from './screens/main/Chapters';
import { Home } from './screens/main/Home';
import PaymentScreen from './screens/main/Payment';
import PlansScreen from './screens/main/Plans';
import Privacy from './screens/main/Privacy';
import { Profile } from './screens/main/Profile';
import Subjects from './screens/main/Subjects';
import SubscriptionMessage from './screens/main/SubscriptionMessage';
import TermsAndConditions from './screens/main/TermsAndConditions';
import TopicContent from './screens/main/TopicContent';
import Topics from './screens/main/Topics';

import { TPlan } from './types/Plan';
import { TTopic } from './types/Topic';

// ================= NAVIGATION TYPES =================
type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

type AuthStackParamList = {
    Login: undefined;
    SetEmail: undefined;
    SetAccountPassword: undefined;
    AskForEmail: undefined;
    OTPVerification: undefined;
    RegistrationOTPVerification: undefined;
    ResetPassword: undefined;
    Landing: undefined;
    Privacy: undefined;
    TermsAndConditions: undefined;
};

// 🔥 IMPORTANT: EXPORTED FOR OTHER SCREENS
export type MainStackParamList = {
    HomeScreen: undefined;
    SubjectsScreen: undefined;
    ProfileScreen: undefined;
    Chapters: {
        subjectId: string;
        subjectTitle: string;
    };
    Topics: {
        subjectId: string;
        chapterId: string;
        chapterTitle: string;
        subjectTitle: string;
        chapterNumber: number;
    };
    TopicContent: {
        topic: TTopic;
    };
    Plans: undefined;
    Payment: {
        plan: TPlan;
    };
    SubscriptionMessage: {
        success: boolean;
    };
};

// ================= CLIENTS =================
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 2,
            cacheTime: 1000 * 60 * 5,
        },
    },
});

// ================= NAVIGATORS =================
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<MainStackParamList>();
const SubjectsStack = createNativeStackNavigator<MainStackParamList>();
const ProfileStack = createNativeStackNavigator<MainStackParamList>();

// ================= AUTH NAV =================
const AuthNavigator = React.memo(() => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Landing" component={Landing} />
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="SetEmail" component={SetEmail} />
        <AuthStack.Screen name="OTPVerification" component={OTPVerification} />
        <AuthStack.Screen name="RegistrationOTPVerification" component={RegisterOTPVerification} />
        <AuthStack.Screen name="SetAccountPassword" component={SetAccountPassword} />
        <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
        <AuthStack.Screen name="AskForEmail" component={AskForEmail} />
        <AuthStack.Screen name="Privacy" component={Privacy} />
        <AuthStack.Screen name="TermsAndConditions" component={TermsAndConditions} />
    </AuthStack.Navigator>
));

// ================= STACKS =================
const HomeStackNavigator = React.memo(() => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="HomeScreen" component={Home} />
        <HomeStack.Screen name="TopicContent" component={TopicContent} />
        <HomeStack.Screen name="Plans" component={PlansScreen} />
        <HomeStack.Screen name="Payment" component={PaymentScreen} />
        <HomeStack.Screen name="SubscriptionMessage" component={SubscriptionMessage} />
    </HomeStack.Navigator>
));

const SubjectsStackNavigator = React.memo(() => (
    <SubjectsStack.Navigator screenOptions={{ headerShown: false }}>
        <SubjectsStack.Screen name="SubjectsScreen" component={Subjects} />
        <SubjectsStack.Screen name="Chapters" component={Chapters} />
        <SubjectsStack.Screen name="Topics" component={Topics} />
        <SubjectsStack.Screen name="TopicContent" component={TopicContent} />
        <SubjectsStack.Screen name="Plans" component={PlansScreen} />
        <SubjectsStack.Screen name="Payment" component={PaymentScreen} />
        <SubjectsStack.Screen name="SubscriptionMessage" component={SubscriptionMessage} />
    </SubjectsStack.Navigator>
));

const ProfileStackNavigator = React.memo(() => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ProfileScreen" component={Profile} />
        <ProfileStack.Screen name="Plans" component={PlansScreen} />
        <ProfileStack.Screen name="Payment" component={PaymentScreen} />
        <ProfileStack.Screen name="SubscriptionMessage" component={SubscriptionMessage} />
    </ProfileStack.Navigator>
));

// ================= MAIN TABS =================
// ================= MAIN TABS =================
const MainNavigator = React.memo(() => (
    <Tab.Navigator
        screenOptions={({ route }: { route: any }) => ({
            headerShown: false,
            tabBarStyle: {
                height: 64,
                paddingTop: 12,
                paddingBottom: 12,
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
            },
            tabBarIcon: ({ focused }: { focused: boolean }) => {
                const Icon =
                    route.name === 'HomeStack'
                        ? HomeIcon
                        : route.name === 'SubjectsStack'
                            ? Notebook
                            : User;

                return (
                    <View>
                        <Icon
                            size={28}
                            color={focused ? '#000000' : '#9CA3AF'}
                            strokeWidth={1.5}
                        />
                    </View>
                );
            },
            tabBarLabel: () => null,
        })}
    >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
        <Tab.Screen name="SubjectsStack" component={SubjectsStackNavigator} />
        <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} />
    </Tab.Navigator>
));

// ================= APP CONTENT =================
const AppContent = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#FDF6F0]">
                <ActivityIndicator size="large" color="#1A1A1A" />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="auto" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <Stack.Screen name="Main" component={MainNavigator} />
                )}
            </Stack.Navigator>
        </>
    );
};

// ================= ERROR HANDLER =================
const generateCorrelationId = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const errorHandler = (error: Error, info?: { componentStack?: string }) => {
    const correlationId = generateCorrelationId();
    const payload = {
        correlationId,
        name: error.name,
        message: error.message,
        stack: error.stack ?? info?.componentStack,
        time: new Date().toISOString(),
    };

    // Structured log for easier parsing in remote logging systems
    // Keep console.error to ensure visibility in development and native logs
    console.error(JSON.stringify(payload));
};

// ================= ROOT APP =================
export default function App() {
    usePreventScreenCapture();

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <ErrorBoundary onError={errorHandler} FallbackComponent={Fallback}>
                            <AppContent />
                        </ErrorBoundary>
                    </AuthProvider>
                </QueryClientProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}