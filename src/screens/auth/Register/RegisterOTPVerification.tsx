import { useGetRegistrationOTP, useVerifyRegistrationOTP } from '@/hooks/api/auth';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
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

type OTPVerificationProps = {
  navigation: any;
  route: any;
};

export const RegisterOTPVerification = ({ navigation, route }: OTPVerificationProps) => {
  const { email } = route.params;
  const insets = useSafeAreaInsets();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const { mutate: verifyOTP, isPending } = useVerifyRegistrationOTP();
  const { mutate: resendOtp, isPending: isResending } = useGetRegistrationOTP();

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const handleOtpChange = (value: string, index: number) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 1) {
      const pastedOtp = numericValue.slice(0, 6).split('');
      const updatedOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) updatedOtp[index + i] = char;
      });
      setOtp(updatedOtp);
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
    if (numericValue && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const normalizedEmail = String(email || '').trim();
    if (!normalizedEmail) {
      Alert.alert('Error', 'Email not found. Please try again');
      navigation.navigate('SetEmail');
      return;
    }
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    verifyOTP(
      { email: normalizedEmail, otp: otpString },
      {
        onSuccess: (data) => {
          const verificationToken = String(data?.data?.token || '').trim();
          if (!verificationToken) {
            Alert.alert('Error', 'Internal Server Error.');
            return;
          }
          navigation.navigate('SetAccountPassword', {
            email: normalizedEmail,
            verificationToken,
          });
        },
        onError: (error) => {
          const message =
            (error as any)?.userMessage ||
            (error as any)?.details?.data?.message ||
            (error as any)?.message ||
            'Unable to verify OTP.';
          Alert.alert('Error', message);
        },
      }
    );
  };

  const handleResend = async () => {
    const normalizedEmail = String(email || '').trim();
    if (!normalizedEmail || resendIn > 0) return;

    resendOtp(normalizedEmail, {
      onSuccess: (data: any) => {
        const devOtp = String(data?.data?.otp || '').trim();
        if (devOtp) {
          Alert.alert('Verification Code', `Enter this OTP manually: ${devOtp}`);
        } else {
          Alert.alert('Sent', 'A new OTP has been sent to your email.');
        }
        setResendIn(30);
      },
      onError: (error: any) => {
        Alert.alert('Error', String(error?.userMessage || error?.message || 'Unable to resend OTP.'));
      },
    });
  };

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

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
              <View style={styles.progressDotDone} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={styles.progressDot} />
            </View>

            {/* Icon */}
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>✉️</Text>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Verify Email OTP</Text>
              <View style={styles.titleUnderline} />
            </View>

            <Text style={styles.subtitle}>
              Enter the 6-digit OTP sent to{'\n'}
              <Text style={{ fontWeight: '700', color: '#1a1a1a' }}>{maskedEmail}</Text>
            </Text>

            {/* OTP inputs */}
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    focusedIndex === index
                      ? styles.otpInputFocused
                      : otp[index]
                        ? styles.otpInputFilled
                        : styles.otpInputBlurred,
                  ]}
                  maxLength={1}
                  keyboardType="numeric"
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  value={otp[index]}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Resend */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isResending || resendIn > 0}>
                <Text style={[styles.resendLink, (isResending || resendIn > 0) && styles.resendLinkDisabled]}>
                  {isResending ? 'Sending...' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action button */}
            <TouchableOpacity
              onPress={handleContinue}
              style={[styles.button, isPending && styles.buttonDisabled]}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending
                ? <ActivityIndicator color="#1a1a1a" />
                : <Text style={styles.buttonText}>Verify & Continue →</Text>}
            </TouchableOpacity>
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
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  progressDot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#e5e7eb' },
  progressDotActive: { backgroundColor: '#FED93A' },
  progressDotDone: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#1a1a1a' },
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
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24, marginTop: 10, lineHeight: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpInput: {
    width: 46, height: 56, backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 2, textAlign: 'center',
    fontSize: 22, fontWeight: '700', color: '#1a1a1a',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  otpInputFocused: { borderColor: '#FED93A', backgroundColor: '#fffbf0' },
  otpInputFilled: { borderColor: '#FED93A', backgroundColor: '#fffbf0' },
  otpInputBlurred: { borderColor: '#e5e7eb' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  resendText: { fontSize: 14, color: '#6b7280' },
  resendLink: { fontSize: 14, color: '#FED93A', fontWeight: '700', textDecorationLine: 'underline' },
  resendLinkDisabled: { color: '#9ca3af', textDecorationLine: 'none' },
  button: {
    backgroundColor: '#FED93A', height: 54, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FED93A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#FED93A' },
  buttonText: { color: '#1a1a1a', fontSize: 17, fontWeight: '700' },
});

export default RegisterOTPVerification;
