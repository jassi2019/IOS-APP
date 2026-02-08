import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Privacy = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView className="flex-1 bg-[#F1BB3E]/10">
      <StatusBar style="dark" />

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold mb-6">Privacy Policy</Text>

        <Text className="text-gray-600 mb-6">Last Updated: January 27, 2025</Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">1. Introduction</Text>
          <Text className="text-gray-700 leading-relaxed">
            Welcome to Taiyari NEET ki ("we," "our," or "us"). We are committed to protecting your
            privacy and ensuring the security of your personal information. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use our
            educational platform and services.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">2. Information We Collect</Text>
          <Text className="text-gray-700 leading-relaxed mb-2">
            We collect the following types of information:
          </Text>
          <Text className="text-gray-700 leading-relaxed mb-1">
            • Personal Information: Name, email address, phone number, and academic history
          </Text>
          <Text className="text-gray-700 leading-relaxed mb-1">
            • Usage Data: Study patterns, test scores, and platform interaction statistics
          </Text>
          <Text className="text-gray-700 leading-relaxed mb-1">
            • Device Information: Device type, operating system, and IP address
          </Text>
          <Text className="text-gray-700 leading-relaxed">
            • Account Information: Profile details you provide in the app
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">3. How We Use Your Information</Text>
          <Text className="text-gray-700 leading-relaxed mb-2">We use your information to:</Text>
          <Text className="text-gray-700 leading-relaxed mb-1">
            • Personalize your learning experience
          </Text>
          <Text className="text-gray-700 leading-relaxed mb-1">• Track your academic progress</Text>
          <Text className="text-gray-700 leading-relaxed mb-1">• Provide customer support</Text>
          <Text className="text-gray-700 leading-relaxed">
            • Improve our educational services and content
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">4. Data Security</Text>
          <Text className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">5. Data Sharing</Text>
          <Text className="text-gray-700 leading-relaxed">
            We may share your information with third-party service providers who assist us in
            operating our platform, conducting our business, or serving our users. These third
            parties are bound by confidentiality agreements and are prohibited from using your
            information for any other purpose.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">6. Your Rights</Text>
          <Text className="text-gray-700 leading-relaxed mb-2">You have the right to:</Text>
          <Text className="text-gray-700 leading-relaxed mb-1">
            • Access your personal information
          </Text>
          <Text className="text-gray-700 leading-relaxed mb-1">
            • Correct inaccurate information
          </Text>
          <Text className="text-gray-700 leading-relaxed mb-1">
            • Request deletion of your information
          </Text>
          <Text className="text-gray-700 leading-relaxed">
            • Opt-out of marketing communications
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">7. Contact Us</Text>
          <Text className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy or our practices, please contact us
            at:{'\n'}
            Email: privacy@taiyarineetki.com{'\n'}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">8. Changes to This Policy</Text>
          <Text className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the "Last Updated" date at
            the top of this policy.
          </Text>
        </View>

        <TouchableOpacity
          className="bg-gray-900 py-4 rounded-lg mb-20"
          activeOpacity={0.8}
          onPress={() => {
            if (navigation.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
              return;
            }
            if (navigation.popToTop) {
              navigation.popToTop();
            }
          }}
        >
          <Text className="text-white text-center text-lg font-semibold">Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Privacy;
