import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutUs = ({ navigation }: { navigation: any }) => {
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
          <Text style={styles.headerTitle}>About Us</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, Platform.OS === 'web' && styles.contentWeb]}>
          <Text style={styles.title}>About Taiyari NEET Ki</Text>
          <Text style={styles.paragraph}>
            Taiyari NEET Ki is built to make NEET preparation simple, structured, and consistent.
            We focus on clear explanations, topic-wise learning, and regular practice so students
            can move from basics to confidence.
          </Text>

          <Text style={styles.sectionTitle}>Our Goal</Text>
          <Text style={styles.paragraph}>
            Our goal is to provide a focused learning platform where aspirants can revise faster,
            track progress, and stay exam-ready with quality content.
          </Text>

          <Text style={styles.sectionTitle}>What You Get</Text>
          <Text style={styles.paragraph}>
            1. Structured chapters and topics{'\n'}
            2. Free and premium learning paths{'\n'}
            3. Continuous updates for better preparation
          </Text>

          <TouchableOpacity style={styles.footerButton} activeOpacity={0.85} onPress={goBack}>
            <Text style={styles.footerButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    marginTop: 14,
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
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
