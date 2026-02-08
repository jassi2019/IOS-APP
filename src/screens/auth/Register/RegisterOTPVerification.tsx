import { useVerifyRegistrationOTP } from '@/hooks/api/auth';
import tokenManager from '@/lib/tokenManager';
import { ChevronLeft } from 'lucide-react-native';
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
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { mutate: verifyOTP, isPending } = useVerifyRegistrationOTP();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      // Handle paste
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

    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please try again');
      navigation.navigate('AskForEmail');
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }

    verifyOTP(
      { email, otp: otpString },
      {
        onSuccess: (data) => {
          if (!data?.data?.token) {
            Alert.alert('Error', 'Internal Server Error.');
            return;
          }
          tokenManager.setToken(data.data.token);
          navigation.navigate('SetAccountPassword', { email });
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
        style={styles.container}
      >
        <ImageBackground
          source={require('../../../assets/images/background-pattern.png')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="#1e1e1e" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>
                Verify Your{'\n'}Account
              </Text>
              <View style={styles.titleUnderline} />
            </View>

            {/* Subtitle */}
            <View style={styles.subtitleSection}>
              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to
              </Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            {/* OTP Input Container */}
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    focusedIndex === index ? styles.otpInputFocused : styles.otpInputBlurred
                  ]}
                  maxLength={1}
                  keyboardType="numeric"
                  value={otp[index]}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus={true}
                />
              ))}
            </View>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={() => Alert.alert('Request', 'Resend OTP feature coming soon.')}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              onPress={handleContinue}
              style={[
                styles.button,
                isPending ? styles.buttonDisabled : styles.buttonEnabled
              ]}
              disabled={isPending}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>VERIFY & CONTINUE</Text>
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
    width: '100%',
  },
  header: {
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 42,
  },
  titleUnderline: {
    height: 4,
    width: 48,
    backgroundColor: '#1e1e1e',
    marginTop: 12,
    borderRadius: 2,
  },
  subtitleSection: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emailText: {
    fontSize: 16,
    color: '#1e1e1e',
    fontWeight: 'bold',
    marginTop: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1e1e',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 2,
  },
  otpInputFocused: {
    borderColor: '#1e1e1e',
  },
  otpInputBlurred: {
    borderColor: '#F0F0F0',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 15,
    color: '#1e1e1e',
    fontWeight: '800',
  },
  button: {
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
  },
  buttonEnabled: {
    backgroundColor: '#1e1e1e',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});

export default RegisterOTPVerification;
