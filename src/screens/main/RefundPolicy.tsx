import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RefundPolicy = ({ navigation }: { navigation: any }) => {
  const goBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    if (navigation?.popToTop) {
      navigation.popToTop();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={[styles.headerRow, Platform.OS === 'web' && styles.headerRowWeb]}>
          <TouchableOpacity onPress={goBack} style={styles.backButton} hitSlop={10}>
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refund Policy</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, Platform.OS === 'web' && styles.contentWeb]}>
          <Text style={styles.title}>Refund Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: February 11, 2026</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Digital Subscription</Text>
            <Text style={styles.paragraph}>
              Taiyari NEET Ki provides digital educational content. Refund eligibility depends on
              the platform used for purchase and applicable law.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Apple In-App Purchase</Text>
            <Text style={styles.paragraph}>
              Purchases made on iOS are processed by Apple. Refund requests for iOS must be made
              through Apple at reportaproblem.apple.com or Apple Support.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Subscription Cancellation</Text>
            <Text style={styles.paragraph}>
              Auto-renewing iOS subscriptions can be managed or cancelled from your Apple ID
              subscription settings. Cancellation prevents future renewals and does not retroactively
              refund already processed periods unless approved by Apple.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Failed/Duplicate Payments</Text>
            <Text style={styles.paragraph}>
              If a payment is deducted but access is not granted, contact support with transaction
              details. Valid failed or duplicate cases are handled based on platform billing rules.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Contact</Text>
            <Text style={styles.paragraph}>
              For billing help, email: billing@taiyarineetki.com
            </Text>
          </View>

          <TouchableOpacity style={styles.footerButton} activeOpacity={0.85} onPress={goBack}>
            <Text style={styles.footerButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RefundPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRowWeb: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
  },
  contentWeb: {
    maxWidth: 920,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footerButton: {
    marginTop: 12,
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
