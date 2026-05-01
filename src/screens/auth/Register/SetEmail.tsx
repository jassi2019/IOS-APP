import { useGetRegistrationOTP } from '@/hooks/api/auth';
import { ChevronLeft, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RegisterProps = {
  navigation: any;
};

export const SetEmail = ({ navigation }: RegisterProps) => {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const { mutate: getRegistrationOTP, isPending } = useGetRegistrationOTP();

  const handleSubmit = async () => {
    const normalizedEmail = String(email || '').trim();

    if (!normalizedEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    getRegistrationOTP(normalizedEmail, {
      onSuccess: (data: any) => {
        const devOtp = String(data?.data?.otp || '').trim();
        if (devOtp) {
          Alert.alert('Verification Code', `Enter this OTP manually: ${devOtp}`);
        }
        navigation.navigate('RegisterOTPVerification', {
          email: normalizedEmail,
        });
      },
      onError: (error: any) => {
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.background}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Progress */}
            <View style={styles.progressRow}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create Account</Text>
              <View style={styles.titleUnderline} />
            </View>

            <Text style={styles.subtitle}>Step 1 of 3 — OTP will be sent to your email</Text>

            {/* Email input */}
            <Text style={styles.fieldLabel}>
              <Text style={styles.requiredDot}>● </Text>Email Address *
            </Text>
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
              <Mail size={18} color={emailFocused ? '#FED93A' : '#9ca3af'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="john@gmail.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending
                ? <ActivityIndicator color="#1a1a1a" />
                : <Text style={styles.submitButtonText}>Send OTP →</Text>}
            </TouchableOpacity>

            {/* Login link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, backgroundColor: '#FDF6F0', width: '100%' },
  header: { paddingHorizontal: 24 },
  backButton: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1, borderColor: '#F0F0F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  progressDot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#e5e7eb' },
  progressDotActive: { backgroundColor: '#FED93A' },
  titleContainer: { marginBottom: 8 },
  title: { fontSize: 38, fontWeight: '800', color: '#1a1a1a', lineHeight: 44 },
  titleAccentRow: { alignSelf: 'flex-start' },
  titleAccent: { fontSize: 38, fontWeight: '800', color: '#1a1a1a', lineHeight: 44 },
  titleUnderline: { height: 4, backgroundColor: '#FED93A', borderRadius: 2, marginTop: 4, width: '100%' },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 22, marginTop: 10, lineHeight: 18 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6 },
  requiredDot: { color: '#FED93A', fontSize: 10 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#e5e7eb',
    paddingHorizontal: 14, height: 54, marginBottom: 20,
  },
  inputWrapperFocused: { borderColor: '#FED93A', backgroundColor: '#fffbf0' },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  submitButton: {
    backgroundColor: '#FED93A', borderRadius: 12, height: 54,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FED93A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 20,
  },
  submitButtonDisabled: { backgroundColor: '#FED93A' },
  submitButtonText: { color: '#1a1a1a', fontSize: 17, fontWeight: '700' },
  loginContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginText: { color: '#374151', fontSize: 15 },
  loginLinkText: { color: '#78350f', fontSize: 15, fontWeight: '700', textDecorationLine: 'underline' },
});

export default SetEmail;
