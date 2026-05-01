import { useAuth } from '@/contexts/AuthContext';
import { useRegister } from '@/hooks/api/auth';
import { useGetProfile } from '@/hooks/api/user';
import tokenManager from '@/lib/tokenManager';
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { SafeAreaView } from 'react-native-safe-area-context';

interface RegisterProps {
  navigation: any;
  route: any;
}

export const SetAccountPassword = ({ navigation, route }: RegisterProps) => {
  const { email } = route.params;
  const verificationToken = route?.params?.verificationToken;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const { mutate: register, isPending } = useRegister();
  const { setUser } = useAuth();
  const { refetch: getProfile } = useGetProfile({ enabled: false });

  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 4;
    return 3;
  };
  const strength = getStrength();
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f97316', '#FED93A', '#22c55e'];

  const handleSubmit = async () => {
    const normalizedEmail = String(email || '').trim();
    if (!normalizedEmail) {
      Alert.alert('Error', 'Email not found. Please try again.');
      return;
    }
    const normalizedVerificationToken = String(verificationToken || '').trim();
    if (!normalizedVerificationToken) {
      Alert.alert('Error', 'Verification expired. Please verify OTP again.');
      navigation.navigate('SetEmail');
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
        verificationToken: normalizedVerificationToken,
        profilePicture: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`,
      },
      {
        onSuccess: async (res: any) => {
          try {
            const token = res?.data?.token;
            if (token) await tokenManager.setToken(token);
            const { data: profileData } = await getProfile();
            if (profileData && profileData.data) {
              setUser(profileData.data);
            } else {
              Alert.alert('Account created', 'Please login once to sync profile.');
              navigation.navigate('Login');
            }
          } catch {
            Alert.alert('Account created', 'Please login once to continue.');
            navigation.navigate('Login');
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.background}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Progress */}
              <View style={styles.progressRow}>
                <View style={styles.progressDotDone} />
                <View style={styles.progressDotDone} />
                <View style={[styles.progressDot, styles.progressDotActive]} />
              </View>

              {/* Verified badges */}
              <View style={styles.badgeRow}>
                <View style={styles.doneBadge}>
                  <Text style={styles.doneBadgeText}>✓ Email verified</Text>
                </View>
                <View style={styles.doneBadge}>
                  <Text style={styles.doneBadgeText}>✓ Phone verified</Text>
                </View>
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Set your Password</Text>
                <View style={styles.titleUnderline} />
              </View>
              <Text style={styles.subtitle}>Step 3 of 3 — Almost done!</Text>

              {/* Password input */}
              <Text style={styles.fieldLabel}>
                <Text style={styles.requiredDot}>● </Text>New Password
              </Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Lock size={18} color={passwordFocused ? '#FED93A' : '#9ca3af'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
                </TouchableOpacity>
              </View>

              {/* Strength bar */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={[
                          styles.strengthSeg,
                          i <= strength && { backgroundColor: strengthColors[strength] },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>
                    {strengthLabels[strength]}
                  </Text>
                </View>
              )}

              {/* Confirm password */}
              <Text style={styles.fieldLabel}>
                <Text style={styles.requiredDot}>● </Text>Confirm Password
              </Text>
              <View style={[styles.inputWrapper, confirmFocused && styles.inputWrapperFocused]}>
                <Lock size={18} color={confirmFocused ? '#FED93A' : '#9ca3af'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  {showConfirmPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
                </TouchableOpacity>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.button, isPending && styles.buttonDisabled]}
                disabled={isPending}
                activeOpacity={0.85}
              >
                {isPending
                  ? <ActivityIndicator color="#1a1a1a" />
                  : <Text style={styles.buttonText}>Create Account 🎉</Text>}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>By creating an account, you agree to our </Text>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Terms & Conditions</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDF6F0' },
  container: { flex: 1 },
  background: { flex: 1, backgroundColor: '#FDF6F0', width: '100%' },
  header: { paddingHorizontal: 24, paddingTop: 10 },
  backButton: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1, borderColor: '#F0F0F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 },
  progressRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  progressDot: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#e5e7eb' },
  progressDotActive: { backgroundColor: '#FED93A' },
  progressDotDone: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#1a1a1a' },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  doneBadge: {
    backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#86efac',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  doneBadgeText: { fontSize: 12, color: '#166534', fontWeight: '600' },
  titleContainer: { marginBottom: 8 },
  title: { fontSize: 38, fontWeight: '800', color: '#1a1a1a', lineHeight: 44 },
  titleAccentRow: { alignSelf: 'flex-start' },
  titleAccent: { fontSize: 38, fontWeight: '800', color: '#1a1a1a', lineHeight: 44 },
  titleUnderline: { height: 4, backgroundColor: '#FED93A', borderRadius: 2, marginTop: 4, width: '100%' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 22, marginTop: 10 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6 },
  requiredDot: { color: '#FED93A', fontSize: 10 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#e5e7eb',
    paddingHorizontal: 14, height: 54, marginBottom: 12,
  },
  inputWrapperFocused: { borderColor: '#FED93A', backgroundColor: '#fffbf0' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  eyeIcon: { padding: 4 },
  strengthContainer: { marginBottom: 16, marginTop: -4 },
  strengthBar: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  strengthSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb' },
  strengthLabel: { fontSize: 12, textAlign: 'right', fontWeight: '600' },
  button: {
    backgroundColor: '#FED93A', height: 54, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FED93A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: '#FED93A' },
  buttonText: { color: '#1a1a1a', fontSize: 17, fontWeight: '700' },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  footerLink: { fontSize: 12, color: '#1a1a1a', fontWeight: '700' },
});

export default SetAccountPassword;
