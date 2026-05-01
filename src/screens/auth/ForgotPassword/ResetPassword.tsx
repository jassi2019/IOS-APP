import { useAuth } from '@/contexts/AuthContext';
import { useResetPassword } from '@/hooks/api/auth';
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
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();
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
      { password, confirmPassword, resetToken: normalizedResetToken },
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
        <View style={styles.background}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🔑</Text>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>New Password</Text>
              <View style={styles.titleUnderline} />
            </View>

            <Text style={styles.subtitle}>Create a strong new password for your account.</Text>

            {/* Password */}
            <Text style={styles.fieldLabel}>
              <Text style={styles.requiredDot}>● </Text>New Password
            </Text>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <Lock size={18} color={passwordFocused ? '#FED93A' : '#9ca3af'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
              </TouchableOpacity>
            </View>

            {/* Strength */}
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
                placeholder="Confirm New Password"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)} style={styles.eyeIcon}>
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
                : <Text style={styles.buttonText}>Reset Password ✓</Text>}
            </TouchableOpacity>
          </ScrollView>
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
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 },
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
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#FED93A' },
  buttonText: { color: '#1a1a1a', fontSize: 17, fontWeight: '700' },
});

export default ResetPassword;
