import { useRequestPasswordReset, useVerifyPasswordResetOTP } from '@/hooks/api/auth';
import React, { useRef, useState } from 'react';
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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type OTPVerificationProps = {
  navigation: any;
  route: any;
};

export const OTPVerification = ({ navigation, route }: OTPVerificationProps) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendIn, setResendIn] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { mutate: verifyOTP, isPending } = useVerifyPasswordResetOTP();
  const { mutate: resendOtp, isPending: isResending } = useRequestPasswordReset();

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const handleOtpChange = (value: string, index: number) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const nextOtp = [...otp];
    nextOtp[index] = numericValue;
    setOtp(nextOtp);

    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const normalizedEmail = String(email || '').trim();

    if (!normalizedEmail) {
      Alert.alert('Error', 'Email not found. Please try again.');
      navigation.navigate('AskForEmail');
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    verifyOTP(
      { email: normalizedEmail, otp: otpString },
      {
        onSuccess: (data) => {
          const resetToken = String(data?.data?.token || '').trim();
          if (!resetToken) {
            Alert.alert('Error', 'Invalid OTP response. Please try again.');
            return;
          }
          navigation.navigate('ResetPassword', {
            email: normalizedEmail,
            resetToken,
          });
        },
        onError: (error: any) => {
          const message =
            error?.userMessage ||
            error?.details?.data?.message ||
            error?.message ||
            'Unable to verify OTP.';
          Alert.alert('Error', message);
        },
      }
    );
  };

  const handleResend = () => {
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
        const message =
          error?.userMessage ||
          error?.details?.data?.message ||
          error?.message ||
          'Unable to resend OTP.';
        Alert.alert('Error', message);
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome to{'\n'}Taiyari NEET ki</Text>
            </View>

            <Text style={styles.subtitle}>Enter the OTP received in your email</Text>
            <Text style={styles.emailText}>{email}</Text>

            <View style={styles.otpRow}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                  value={otp[index]}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isResending || resendIn > 0}>
                <Text style={[styles.resendLink, (isResending || resendIn > 0) && styles.resendLinkDisabled]}>
                  {isResending ? 'Sending...' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={isPending}>
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
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
    marginBottom: 6,
  },
  emailText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 20,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 20,
    color: '#111827',
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendLink: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  resendLinkDisabled: {
    color: '#9CA3AF',
  },
  continueButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  continueButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default OTPVerification;
