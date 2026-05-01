import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ScreenCapture from 'expo-screen-capture';

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Screen capture policy: nothing forced here (works on iOS). Modify as required.
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Welcome to Education App</Text>
      <Button title="Go to About" onPress={() => navigation.navigate('About' as any)} />
    </View>
  );
}
