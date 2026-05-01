import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContactUs = ({ navigation }: { navigation: any }) => {
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
          <Text style={styles.headerTitle}>Contact Us</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, Platform.OS === 'web' && styles.contentWeb]}>
          <Text style={styles.title}>Need Help?</Text>
          <Text style={styles.paragraph}>
            If you have any issue related to account, payment, content access, or app usage, reach
            out to us using the details below.
          </Text>

          <View style={styles.contactBlock}>
            <Text style={styles.label}>Support Email</Text>
            <Text style={styles.value}>support@taiyarineetki.com</Text>
          </View>

          <View style={styles.contactBlock}>
            <Text style={styles.label}>Billing/Subscription</Text>
            <Text style={styles.value}>billing@taiyarineetki.com</Text>
          </View>

          <View style={styles.contactBlock}>
            <Text style={styles.label}>Response Time</Text>
            <Text style={styles.value}>Usually within 24-48 hours</Text>
          </View>

          <TouchableOpacity style={styles.footerButton} activeOpacity={0.85} onPress={goBack}>
            <Text style={styles.footerButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUs;

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
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    marginBottom: 10,
  },
  contactBlock: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  footerButton: {
    marginTop: 20,
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
