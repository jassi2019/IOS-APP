import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Bullet = ({ children }: { children: string }) => {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>{'\u2022'}</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
};

const Privacy = ({ navigation }: { navigation: any }) => {
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, Platform.OS === 'web' && styles.contentWeb]}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: February 11, 2026</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to Taiyari NEET ki ("we," "our," or "us"). We are committed to protecting your
              privacy and ensuring the security of your personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our
              educational platform and services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.paragraph}>We collect the following types of information:</Text>
            <View style={styles.bullets}>
              <Bullet>Personal Information: Name, email address, and profile details</Bullet>
              <Bullet>Usage Data: Study progress, topic completion, and in-app activity</Bullet>
              <Bullet>Device Information: Device model, OS, app version, and IP address</Bullet>
              <Bullet>Account Information: Profile details you provide in the app</Bullet>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.paragraph}>We use your information to:</Text>
            <View style={styles.bullets}>
              <Bullet>Personalize your learning experience</Bullet>
              <Bullet>Track your academic progress</Bullet>
              <Bullet>Provide customer support</Bullet>
              <Bullet>Improve our educational services and content</Bullet>
              <Bullet>Maintain account security and fraud prevention</Bullet>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
              However, no method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Sharing</Text>
            <Text style={styles.paragraph}>
              We may share your information with third-party service providers who assist us in
              operating our platform, conducting our business, or serving our users. These third
              parties are bound by confidentiality agreements and are prohibited from using your
              information for any other purpose.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Billing and App Store Data</Text>
            <Text style={styles.paragraph}>
              On iOS, in-app purchase billing is handled by Apple. We do not store your card or
              Apple payment credentials. We only receive purchase status and transaction references
              needed to activate your subscription.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Your Rights</Text>
            <Text style={styles.paragraph}>You have the right to:</Text>
            <View style={styles.bullets}>
              <Bullet>Access your personal information</Bullet>
              <Bullet>Correct inaccurate information</Bullet>
              <Bullet>Request deletion of your information</Bullet>
              <Bullet>Opt-out of marketing communications</Bullet>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy or our practices, please contact us
              at:{'\n'}
              Email: support@taiyarineetki.com{'\n'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last Updated" date at
              the top of this policy.
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

export default Privacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(241,187,62,0.10)',
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
    marginBottom: 18,
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
  bullets: {
    marginTop: 10,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletMark: {
    width: 14,
    fontSize: 18,
    lineHeight: 20,
    color: '#111827',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footerButton: {
    marginTop: 14,
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
