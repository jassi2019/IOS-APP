// src/screens/auth/otp-verification/OTPVerification.tsx
import { useRequestPasswordReset, useVerifyPasswordResetOTP } from '@/hooks/api/auth';
import tokenManager from '@/lib/tokenManager';
import React, { useRef, useState } from 'react';
import {
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

type OTPVerificationProps = {
  navigation: any;
  route: any;
};

export const OTPVerification = ({ navigation, route }: OTPVerificationProps) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendIn, setResendIn] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { mutate: verifyOTP } = useVerifyPasswordResetOTP();
  const { mutate: resendOtp, isPending: isResending } = useRequestPasswordReset();

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    const numericValue = value.replace(/[^0-9]/g, '');
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
    const normalizedEmail = String(email || '').trim();

    if (!normalizedEmail) {
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
      { email: normalizedEmail, otp: otpString },
      {
        onSuccess: (data) => {
          if (!data?.data) {
            Alert.alert('Error', 'Internal Server Error.');
            return;
          }
          tokenManager.setToken(data.data.token);
          navigation.navigate('ResetPassword', { email: normalizedEmail });
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  const handleResend = async () => {
    const normalizedEmail = String(email || '').trim();
    if (!normalizedEmail) return;
    if (resendIn > 0) return;

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
              <Text className="text-6xl font-bold text-[#1e1e1e] leading-tight">
                Welcome to{'\n'}Taiyari NEET ki
              </Text>
            </View>

            {/* Subtitle */}
            <Text className="text-lg text-gray-600 mb-8">Enter the OTP received in your email</Text>

            {/* OTP Input */}
            <View className="flex-row justify-between mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <React.Fragment key={index}>
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    className="bg-white w-14 h-14 border border-gray-200 rounded-xl text-center text-xl text-black"
                    maxLength={1}
                    keyboardType="numeric"
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    selectTextOnFocus={true}
                  />
                  {index === 2 && <View className="w-4 h-1 bg-gray-800 self-center rounded-full" />}
                </React.Fragment>
              ))}
            </View>

            <View className="flex-row justify-center items-center mb-2">
              <Text className="text-base text-gray-600">Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isResending || resendIn > 0}>
                <Text className={isResending || resendIn > 0 ? 'text-base text-gray-400 font-bold' : 'text-base text-black font-bold'}>
                  {isResending ? 'Sending...' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity onPress={handleContinue} className="bg-[#1e1e1e] rounded-xl mt-4 p-4">
              <Text className="text-white text-center text-lg font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OTPVerification;
