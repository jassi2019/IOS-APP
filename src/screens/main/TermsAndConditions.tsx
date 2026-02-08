import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsAndConditions = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold mb-6">Terms and Conditions</Text>

        <Text className="text-gray-600 mb-6">Last Updated: January 27, 2025</Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">1. Acceptance of Terms</Text>
          <Text className="text-gray-700 leading-relaxed">
            By using Taiyari NEET ki, you agree to these Terms and Conditions. If you do not agree,
            please refrain from using the app.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">2. App Purpose</Text>
          <Text className="text-gray-700 leading-relaxed">
            Taiyari NEET ki is an educational platform designed to simplify NEET preparation by
            providing clear and concise explanations of NCERT content. It aims to help students
            prepare for exams efficiently.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">3. User Accounts</Text>
          <Text className="text-gray-700 leading-relaxed">
            Users are required to create an account to access certain features. You are responsible
            for maintaining the confidentiality of your account information.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">4. Content Ownership</Text>
          <Text className="text-gray-700 leading-relaxed">
            All content on Taiyari NEET ki is the intellectual property of the app and its creators.
            Unauthorized reproduction or distribution is strictly prohibited.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">5. Privacy Policy</Text>
          <Text className="text-gray-700 leading-relaxed">
            We value your privacy. Please review our Privacy Policy to understand how we collect,
            use, and protect your personal data.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">6. Limitation of Liability</Text>
          <Text className="text-gray-700 leading-relaxed">
            Taiyari NEET ki will not be held liable for any damages resulting from the use or
            inability to use the app.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">7. Modifications to Terms</Text>
          <Text className="text-gray-700 leading-relaxed">
            We reserve the right to update these Terms and Conditions at any time. Users are advised
            to review them periodically for any changes.
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

export default TermsAndConditions;
