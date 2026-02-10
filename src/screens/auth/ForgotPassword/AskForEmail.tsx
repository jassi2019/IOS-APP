import { useRequestPasswordReset } from '@/hooks/api/auth';
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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type AskForEmailProps = {
  navigation: any;
};

export const AskForEmail = ({ navigation }: AskForEmailProps) => {
  const [email, setEmail] = useState('');
  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset();

  const handleSubmit = async () => {
    const normalizedEmail = String(email || '').trim();

    if (!normalizedEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    requestPasswordReset(normalizedEmail, {
      onSuccess: (data: any) => {
        // Dev fallback (SMTP not configured): backend can return OTP. Show it, but user must enter manually.
        const devOtp = String(data?.data?.otp || '').trim();
        if (devOtp) {
          Alert.alert('Verification Code', `Enter this OTP manually: ${devOtp}`);
        }

        navigation.navigate('OTPVerification', { email: normalizedEmail });
      },
      onError: (error: any) => {
        console.error('❌ Password Reset Error:', error);

        // Handle different error types
        let errorMessage = 'Password reset request failed. Please try again.';

        if (error?.code === 'TIMEOUT') {
          errorMessage = 'Connection timeout. Please check your internet connection and try again.';
        } else if (error?.code === 'NETWORK_ERROR') {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error?.message) {
          errorMessage = error.message;
        }

        Alert.alert('Password Reset Error', errorMessage);
      },
    });
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
            <Text style={styles.subtitle}>Please enter your email to reset your password</Text>

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
});

export default AskForEmail;
