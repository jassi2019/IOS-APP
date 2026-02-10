import { useAuth } from '@/contexts/AuthContext';
import { useRegister } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RegisterProps {
  navigation: any;
  route: any;
}

export const SetAccountPassword = ({ navigation, route }: RegisterProps) => {
  const { email } = route.params;
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: register, isPending } = useRegister();
  const { setUser } = useAuth();
  const { refetch: getProfile } = useGetProfile({
    enabled: false,
  });

  const handleSubmit = async () => {
    const normalizedEmail = String(email || '').trim();

    if (!normalizedEmail) {
      Alert.alert('Error', 'Email not found. Please try again.');
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

    register(
      {
        email: normalizedEmail,
        password,
        profilePicture: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1
          }`,
      },
      {
        onSuccess: async () => {
          try {
            const { data: profileData } = await getProfile();
            if (profileData && profileData.data) {
              setUser(profileData.data);
            } else {
              Alert.alert('Error', 'Failed to fetch profile data');
            }
          } catch (err) {
            Alert.alert('Error', 'Failed to fetch profile data');
          }
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

          Alert.alert('Error', errorMessage);
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
                Secure Your{'\n'}Account
              </Text>
              <View style={styles.titleUnderline} />
            </View>

            {/* Subtitle */}
            <View style={styles.subtitleSection}>
              <Text style={styles.subtitle}>
                Set a strong password for your account associated with
              </Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            {/* Input fields */}
            <View style={styles.inputStack}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
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
                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>By creating an account, you agree to our </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms & Conditions</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    lineHeight: 22,
  },
  emailText: {
    fontSize: 16,
    color: '#1e1e1e',
    fontWeight: 'bold',
    marginTop: 4,
  },
  inputStack: {
    marginBottom: 32,
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
    shadowColor: "#000",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
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
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 13,
    color: '#1e1e1e',
    fontWeight: '700',
  }
});

export default SetAccountPassword;
