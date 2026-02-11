import { useAuth } from '@/contexts/AuthContext';
import { useResetPassword } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import tokenManager from '@/lib/tokenManager';
import backgroundPattern from '../../../assets/images/background-pattern.png';
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ResetPasswordRouteParams = {
  email?: string;
  resetToken?: string;
};

interface ResetPasswordProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route: {
    params?: ResetPasswordRouteParams;
  };
}

export const ResetPassword = ({ navigation, route }: ResetPasswordProps) => {
  const email = String(route?.params?.email || '').trim();
  const resetToken = route?.params?.resetToken;
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();
  const { setUser } = useAuth();
  const { refetch: getProfile } = useGetProfile({
    enabled: false,
  });

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please try again.');
      return;
    }

    const normalizedResetToken = String(resetToken || '').trim();
    if (!normalizedResetToken) {
      Alert.alert('Error', 'Session expired. Please request OTP again.');
      navigation.navigate('AskForEmail');
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
        resetToken: normalizedResetToken,
      },
      {
        onSuccess: async (response: unknown) => {
          const apiResponse = response as { data?: { token?: string } };
          const nextToken = String(apiResponse?.data?.token || '').trim();
          if (!nextToken) {
            Alert.alert('Password updated', 'Please login with your new password.');
            navigation.navigate('Login');
            return;
          }

          await tokenManager.setToken(nextToken);
          try {
            const { data: profile } = await getProfile();
            if (profile?.data) {
              await setUser(profile.data);
              return;
            }
          } catch {
            // fallback below
          }

          Alert.alert('Password updated', 'Please login with your new password.');
          navigation.navigate('Login');
        },
        onError: (error: unknown) => {
          const normalizedError = error as {
            userMessage?: string;
            details?: { data?: { message?: string } };
            message?: string;
          };
          const message =
            normalizedError?.userMessage ||
            normalizedError?.details?.data?.message ||
            normalizedError?.message ||
            'Unable to reset password.';
          Alert.alert('Error', message);
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
          source={backgroundPattern}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft size={24} color="#1e1e1e" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.title}>Set New Password</Text>
              <View style={styles.titleUnderline} />
            </View>

            <View style={styles.subtitleSection}>
              <Text style={styles.subtitle}>Create a new password for</Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            <View style={styles.inputStack}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, isPending ? styles.buttonDisabled : styles.buttonEnabled]}
              disabled={isPending}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>RESET PASSWORD</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 28,
  },
  titleSection: {
    marginBottom: 22,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 48,
  },
  titleUnderline: {
    height: 4,
    width: 48,
    backgroundColor: '#1e1e1e',
    marginTop: 12,
    borderRadius: 2,
  },
  subtitleSection: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    lineHeight: 22,
  },
  emailText: {
    fontSize: 16,
    color: '#1e1e1e',
    fontWeight: 'bold',
    marginTop: 4,
  },
  inputStack: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 16,
    height: 60,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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

export default ResetPassword;
