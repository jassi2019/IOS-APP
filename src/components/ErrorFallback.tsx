import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ErrorFallback({ error, resetError }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Something went wrong</Text>
      <Text style={{ marginBottom: 12 }}>{String(error)}</Text>
      <Button title="Try again" onPress={resetError} />
    </View>
  );
}
