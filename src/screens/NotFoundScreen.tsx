import React from 'react';
import { View, Text, Button } from 'react-native';

type Props = {
  navigation: any;
};

export default function NotFoundScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Screen not found</Text>
      <Button title="Go Home" onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })} />
    </View>
  );
}
