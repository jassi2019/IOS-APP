import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

export default function NotFoundScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Screen not found</Text>
      <Button title="Go Home" onPress={() => navigation.navigate('Root' as any)} />
    </View>
  );
}
