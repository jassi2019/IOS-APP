import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsAndConditions = ({ navigation }: { navigation: any }) => {
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
          <Text style={styles.headerTitle}>Terms of Use</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, Platform.OS === 'web' && styles.contentWeb]}>
          <Text style={styles.title}>Terms of Use</Text>
          <Text style={styles.lastUpdated}>Last Updated: January 27, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By using Taiyari NEET ki, you agree to these Terms of Use. If you do not agree, please
              refrain from using the app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. App Purpose</Text>
            <Text style={styles.paragraph}>
              Taiyari NEET ki is an educational platform designed to simplify NEET preparation by
              providing clear and concise explanations of NCERT content. It aims to help students
              prepare for exams efficiently.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.paragraph}>
              Users are required to create an account to access certain features. You are responsible
              for maintaining the confidentiality of your account information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Content Ownership</Text>
            <Text style={styles.paragraph}>
              All content on Taiyari NEET ki is the intellectual property of the app and its creators.
              Unauthorized reproduction or distribution is strictly prohibited.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Privacy Policy</Text>
            <Text style={styles.paragraph}>
              We value your privacy. Please review our Privacy Policy to understand how we collect,
              use, and protect your personal data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              Taiyari NEET ki will not be held liable for any damages resulting from the use or
              inability to use the app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Modifications to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to update these Terms of Use at any time. Users are advised to
              review them periodically for any changes.
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

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
