import { XCircle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

const FallBack = () => {
  return (
    <View className="flex-1 items-center justify-center bg-[#F1BB3E]/10 px-4">
      <XCircle size={64} color="#EF4444" />

      <View className="mt-6 items-center">
        <Text className="text-2xl font-bold text-gray-900">Oops! Something went wrong</Text>
        <Text className="mt-2 text-center text-base text-gray-600">
          We encountered an unexpected error.{'\n'}Please try again or contact support if the issue
          persists.
        </Text>
      </View>
    </View>
  );
};

export default FallBack;
