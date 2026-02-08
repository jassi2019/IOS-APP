// Shim modules without TypeScript types to silence "Cannot find module" errors
declare module 'expo';
declare module 'expo-status-bar';
declare module 'expo-screen-capture';
declare module '@react-navigation/native';
declare module '@react-navigation/native-stack';
declare module '@react-navigation/bottom-tabs';
declare module '@tanstack/react-query';
declare module 'react-native-safe-area-context';
declare module 'lucide-react-native';
declare module 'react-native-error-boundary';
declare module '@expo/vector-icons';

// Allow importing CSS in React Native project (used for tailwind global CSS import)
declare module '*.css';
