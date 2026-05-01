import React from 'react';
import { View, Text } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 20 }}>About</Text>
      <Text style={{ marginTop: 8 }}>This app is prepared for iOS (Expo) ✅</Text>
    </View>
  );
}
