import { useRequestPasswordReset } from '@/hooks/api/auth';
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

type AskForEmailProps = {
  navigation: any;
};

export const AskForEmail = ({ navigation }: AskForEmailProps) => {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const { mutate: requestEmailReset, isPending } = useRequestPasswordReset();

  const handleSubmit = () => {
    const normalizedEmail = String(email || '').trim();
    if (!normalizedEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    requestEmailReset(normalizedEmail, {
      onSuccess: (data: any) => {
        const devOtp = String(data?.data?.otp || '').trim();
        if (devOtp) Alert.alert('Dev OTP', `Enter this OTP manually: ${devOtp}`);
        navigation.navigate('OTPVerification', { email: normalizedEmail, isPhone: false });
      },
      onError: (error: any) => {
        let msg = 'Password reset failed. Please try again.';
        if (error?.userMessage) msg = error.userMessage;
        else if (error?.details?.data?.message) msg = error.details.data.message;
        else if (error?.message) msg = error.message;
        Alert.alert('Error', msg);
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
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🔒</Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Forgot Password?</Text>
              <View style={styles.titleUnderline} />
            </View>

            <Text style={styles.subtitle}>
              Enter your email address and we'll send you an OTP to reset your password.
            </Text>

            <Text style={styles.fieldLabel}>
              <Text style={styles.requiredDot}>● </Text>Email Address
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

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, isPending && styles.buttonDisabled]}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending
                ? <ActivityIndicator color="#1a1a1a" />
                : <Text style={styles.buttonText}>Send Reset OTP →</Text>}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Remember password? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
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
  background: { flex: 1, backgroundColor: '#FDF6F0' },
  header: { paddingHorizontal: 24 },
  backButton: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1, borderColor: '#F0F0F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(245,158,11,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  iconText: { fontSize: 28 },
  titleContainer: { marginBottom: 8 },
  title: { fontSize: 38, fontWeight: '800', color: '#1a1a1a', lineHeight: 44 },
  titleAccentRow: { alignSelf: 'flex-start' },
  titleAccent: { fontSize: 38, fontWeight: '800', color: '#1a1a1a', lineHeight: 44 },
  titleUnderline: { height: 4, backgroundColor: '#FED93A', borderRadius: 2, marginTop: 4, width: '100%' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20, marginTop: 10, lineHeight: 20 },
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
  button: {
    backgroundColor: '#FED93A', height: 54, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FED93A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 16,
  },
  buttonDisabled: { backgroundColor: '#FED93A' },
  buttonText: { color: '#1a1a1a', fontSize: 17, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: '#374151', fontSize: 15 },
  loginLink: { color: '#FED93A', fontSize: 15, fontWeight: '700', textDecorationLine: 'underline' },
});

export default AskForEmail;
