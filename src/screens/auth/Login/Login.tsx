import { useAuth } from '@/contexts/AuthContext';
import { useLogin } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import tokenManager from '@/lib/tokenManager';
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
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

export const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const { refetch: getProfile } = useGetProfile({ enabled: false });
  const { setUser } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    const normalizedEmail = String(email || '').trim();
    if (!normalizedEmail || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    login(
      { email: normalizedEmail, password },
      {
        onSuccess: async (data: any) => {
          const token = data?.data?.token || '';
          if (!token) {
            Alert.alert('Login Error', 'Token not received from server.');
            return;
          }
          await tokenManager.setToken(token);
          try {
            const { data: profile } = await getProfile();
            if (profile?.data) setUser(profile.data);
          } catch {
            // Keep session active via token
          }
        },
        onError: (error: any) => {
          let errorMessage = 'Login failed. Please try again.';
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
          if (normalized.includes('invalid credentials')) {
            Alert.alert('Login Failed', 'Invalid email or password.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Forgot Password', onPress: () => navigation.navigate('AskForEmail') },
            ]);
            return;
          }
          Alert.alert('Login Error', errorMessage);
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
        <View style={styles.background}>
          {/* Header with back button */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome to</Text>
              <View style={styles.titleAccentRow}>
                <Text style={styles.titleAccent}>Taiyari NEET ki</Text>
                <View style={styles.titleUnderline} />
              </View>
            </View>

            <Text style={styles.subtitle}>Please enter your credentials</Text>

            {/* Email input */}
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
              <Mail size={18} color={emailFocused ? '#FED93A' : '#9ca3af'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Password input */}
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <Lock size={18} color={passwordFocused ? '#FED93A' : '#9ca3af'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword
                  ? <EyeOff size={20} color="#9ca3af" />
                  : <Eye size={20} color="#9ca3af" />}
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity onPress={() => navigation.navigate('AskForEmail')} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.loginButton, isPending && styles.loginButtonDisabled]}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending
                ? <ActivityIndicator color="#1a1a1a" />
                : <Text style={styles.loginButtonText}>Login</Text>}
            </TouchableOpacity>

            {/* Register link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SetEmail')}>
                <Text style={styles.registerLinkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 44,
  },
  titleAccentRow: {
    alignSelf: 'flex-start',
  },
  titleAccent: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 44,
  },
  titleUnderline: {
    height: 4,
    backgroundColor: '#FED93A',
    borderRadius: 2,
    marginTop: 4,
    width: '100%',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 14,
  },
  inputWrapperFocused: {
    borderColor: '#FED93A',
    backgroundColor: '#fffbf0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#78350f',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#FED93A',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FED93A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#FED93A',
  },
  loginButtonText: {
    color: '#1a1a1a',
    fontSize: 17,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    color: '#374151',
    fontSize: 15,
  },
  registerLinkText: {
    color: '#78350f',
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default Login;
