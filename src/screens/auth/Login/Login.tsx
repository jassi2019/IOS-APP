import { useAuth } from '@/contexts/AuthContext';
import { useLogin } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import tokenManager from '@/lib/tokenManager';
import { Ionicons } from '@expo/vector-icons';
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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const { refetch: getProfile } = useGetProfile({ enabled: false });

  const { setUser } = useAuth();

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
            if (profile?.data) {
              setUser(profile.data);
            }
          } catch {
            // Keep session active via token; profile can sync on next request.
          }
        },
        onError: (error: any) => {
          let errorMessage = 'Login failed. Please try again.';

          if (error?.code === 'TIMEOUT') {
            errorMessage =
              'Connection timeout. Please check your internet connection and try again.';
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

  const handleForgotPassword = () => {
    navigation.navigate('AskForEmail');
  };

  const handleRegister = () => {
    navigation.navigate('SetEmail');
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

            <Text style={styles.subtitle}>Please enter your credentials</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="john.thompson@gmail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.loginButton} disabled={isPending}>
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleRegister} style={styles.registerLink}>
                <Text style={styles.registerLinkText}>Register</Text>
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
    width: '100%',
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
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  passwordInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingRight: 64,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginTop: 16,
    padding: 16,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  registerText: {
    color: '#1A1A1A',
    fontSize: 18,
  },
  registerLink: {
    marginLeft: 4,
  },
  registerLinkText: {
    color: '#F59E0B',
    fontSize: 18,
  },
});

export default Login;
