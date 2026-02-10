import { useGetRegistrationOTP } from '@/hooks/api/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type RegisterProps = {
  navigation: any;
};

export const SetEmail = ({ navigation }: RegisterProps) => {
  const [email, setEmail] = useState('');

  const { mutate: getRegistrationOTP, isPending } = useGetRegistrationOTP();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    getRegistrationOTP(email, {
      onSuccess: (data: any) => {
        const devOtp = String(data?.data?.otp || '').trim();
        navigation.navigate('RegisterOTPVerification', { email, otp: devOtp || undefined });
      },
      onError: (error: any) => {
        console.error('❌ Registration Error:', error);

        // Handle different error types
        let errorMessage = 'Registration failed. Please try again.';

        if (error?.code === 'TIMEOUT') {
          errorMessage = 'Connection timeout. Please check your internet connection and try again.';
        } else if (error?.code === 'NETWORK_ERROR') {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error?.userMessage) {
          errorMessage = error.userMessage;
        } else if (error?.details?.data?.message) {
          errorMessage = error.details.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        const normalized = errorMessage.toLowerCase();
        if (normalized.includes('email already exists')) {
          Alert.alert('Already Registered', 'This email is already registered. Please login.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => navigation.navigate('Login') },
          ]);
          return;
        }

        Alert.alert('Registration Error', errorMessage);
      },
    });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ImageBackground
          source={require('../../../assets/images/background-pattern.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.content}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome to{'\n'}Taiyari NEET ki</Text>
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>Please enter your email</Text>

            {/* Input fields */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="john@gmail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Submit Button */}
            <TouchableHighlight
              onPress={handleSubmit}
              style={styles.submitButton}
              underlayColor="#333"
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableHighlight>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin} style={styles.loginLink}>
                <Text style={styles.loginLinkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    paddingTop: 64,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 56,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginTop: 24,
    padding: 16,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  loginText: {
    color: '#1A1A1A',
    fontSize: 18,
  },
  loginLink: {
    marginLeft: 4,
  },
  loginLinkText: {
    color: '#F59E0B',
    fontSize: 18,
  },
});

export default SetEmail;
