import { useAuth } from '@/contexts/AuthContext';
import { useResetPassword } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface RegisterProps {
  navigation: any;
  route: any;
}

export const ResetPassword = ({ navigation, route }: RegisterProps) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();
  const { setUser } = useAuth();
  const { data, isLoading, error } = useGetProfile({
    enabled: !!isSuccess,
  });

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please try again.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    resetPassword(
      {
        password,
        confirmPassword,
      },
      {
        onSuccess: () => {
          if (data?.data && !isLoading) {
            setUser(data?.data);
            return;
          } else if (error) {
            Alert.alert('Failed to fetch profile');
            return;
          }
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ImageBackground
          source={require('../../../assets/images/background-pattern.png')}
          className="flex-1 bg-[#FDF6F0]"
        >
          <View className="flex-1 px-4 justify-start pt-16">
            {/* Title */}
            <View className="mb-6">
              <Text className="text-6xl font-bold text-black leading-tight">
                Welcome to{'\n'}Taiyari NEET ki
              </Text>
            </View>

            {/* Subtitle */}
            <Text className="text-base text-gray-600 mb-4">
              Please set password for your account
            </Text>

            {/* Input fields */}
            <View className="space-y-4">
              <TextInput
                className="bg-white rounded-xl p-4 text-base text-black mb-4"
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TextInput
                className="bg-white rounded-xl p-4 text-base text-black"
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-[#1A1A1A] rounded-xl mt-6 p-4"
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-medium">Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ResetPassword;
