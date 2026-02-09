import Logo from '@/components/Logo/Logo';
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

const { height } = Dimensions.get('window');

const Landing = ({ navigation }: { navigation: any }) => {
  const { enterGuestMode } = useAuth();
  const statusBarTop = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={[styles.container, { paddingTop: statusBarTop }]}>
      <Image
        source={require('../../../assets/images/landing-bg.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Main Container */}
      <View
        style={[
          styles.mainContainer,
          Platform.OS === 'web' ? styles.mainContainerWeb : null,
        ]}
      >
        {/* Logo and Brand */}
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View style={[styles.spacer, Platform.OS === 'web' ? styles.spacerWeb : null]} />

          {/* Bottom Content Container */}
          <View style={[styles.bottomContainer, Platform.OS === 'web' ? styles.bottomContainerWeb : null]}>
            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
              {/* Get Started Button */}
              <TouchableOpacity
                style={styles.getStartedButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('SetEmail')}
              >
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>

              {/* Guest Mode Button */}
              <TouchableOpacity
                style={styles.guestButton}
                activeOpacity={0.8}
                onPress={enterGuestMode}
              >
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>

            {/* Terms and Privacy */}
            <Text style={styles.termsText}>
              By Signing Up, I agree to the{' '}
              <Text style={styles.linkText} onPress={() => navigation.navigate('TermsAndConditions')}>
                Terms & Conditions
              </Text>{' '}
              and{' '}
              <Text style={styles.linkText} onPress={() => navigation.navigate('Privacy')}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  mainContainerWeb: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  spacer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: height * 0.3,
  },
  spacerWeb: {
    marginBottom: 0,
  },
  bottomContainer: {
    marginBottom: 48,
  },
  bottomContainerWeb: {
    marginBottom: 24,
    backgroundColor: 'rgba(253, 246, 240, 0.92)',
    borderRadius: 18,
    padding: 16,
  },
  buttonsContainer: {
    gap: 16,
  },
  getStartedButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 8,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 8,
  },
  guestButtonText: {
    color: '#1F2937',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 14,
    color: '#374151',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#374151',
  },
});

export default Landing;
