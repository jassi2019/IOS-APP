import { Check, ChevronRight, Clock, RefreshCcw, XCircle } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SubscriptionMessageProps = {
  navigation: any;
  route: any;
};

const SubscriptionMessage = ({ navigation, route }: SubscriptionMessageProps) => {
  const success = !!route?.params?.success;
  const plan = route?.params?.plan;

  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 800,
      delay: 250,
      useNativeDriver: true,
    }).start();
  }, [fadeValue, scaleValue]);

  const handleGoToProfile = () => {
    navigation.navigate('MainTabs', { screen: 'ProfileTab' });
  };

  const handleRetry = () => {
    navigation.navigate('Payment', { plan });
  };

  const iconStroke = success ? '#22C55E' : '#EF4444';
  const iconBg = success ? styles.iconWrapSuccess : styles.iconWrapError;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconOuter}>
            <View style={[styles.iconWrap, iconBg]}>
              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                {success ? <Check size={44} stroke={iconStroke} /> : <XCircle size={44} stroke={iconStroke} />}
              </Animated.View>
            </View>
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeValue,
                transform: [
                  {
                    translateY: fadeValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {success ? (
              <>
                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.subtitle}>Your payment has been processed successfully.</Text>

                <View style={[styles.noticeBox, styles.noticeWarning]}>
                  <Clock size={20} stroke="#CA8A04" />
                  <View style={styles.noticeTextWrap}>
                    <Text style={[styles.noticeTitle, styles.noticeTitleWarning]}>
                      Subscription Under Verification
                    </Text>
                    <Text style={[styles.noticeBody, styles.noticeBodyWarning]}>
                      Your subscription will be activated in a few minutes.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleGoToProfile}
                  style={[styles.button, styles.primaryButton]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>Go to Profile</Text>
                  <ChevronRight size={18} stroke="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>Payment Failed</Text>
                <Text style={styles.subtitle}>
                  We couldn&apos;t process your payment. Please try again.
                </Text>

                <View style={[styles.noticeBox, styles.noticeError]}>
                  <View style={styles.noticeTextWrap}>
                    <Text style={[styles.noticeTitle, styles.noticeTitleError]}>
                      Transaction Unsuccessful
                    </Text>
                    <Text style={[styles.noticeBody, styles.noticeBodyError]}>
                      There might be an issue with your payment method or network connection.
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    onPress={handleRetry}
                    style={[styles.button, styles.primaryButton]}
                    activeOpacity={0.85}
                  >
                    <RefreshCcw size={18} stroke="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>Try Again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleGoToProfile}
                    style={[styles.button, styles.secondaryButton]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.secondaryButtonText}>Back to Profile</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  iconOuter: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSuccess: {
    backgroundColor: '#DCFCE7',
  },
  iconWrapError: {
    backgroundColor: '#FEE2E2',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 18,
  },
  noticeBox: {
    width: '100%',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
  },
  noticeWarning: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FDE68A',
  },
  noticeError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  noticeTextWrap: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  noticeBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  noticeTitleWarning: {
    color: '#92400E',
  },
  noticeBodyWarning: {
    color: '#A16207',
  },
  noticeTitleError: {
    color: '#991B1B',
  },
  noticeBodyError: {
    color: '#B91C1C',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  button: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#F1BB3E',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});

export default SubscriptionMessage;
