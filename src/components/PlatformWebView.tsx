import React from 'react';
import { Platform, View, Text, Linking, StyleSheet } from 'react-native';

type Props = {
  source: { uri: string } | { html: string };
  style?: any;
};

export default function PlatformWebView({ source, style }: Props) {
  if (Platform.OS === 'web') {
    // For web, render an iframe for uri sources, or simple HTML wrapper for html
    if ('uri' in source) {
      return (
        <iframe
          src={source.uri}
          style={{ width: '100%', height: 400, border: 'none', ...(style || {}) }}
          title="webview"
        />
      );
    }

    // html fallback
    return (
      <View style={[styles.webFallback, style]}>
        <Text>HTML content not supported in web fallback.</Text>
      </View>
    );
  }

  try {
    // Lazy require so web doesn't import native module
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WebView } = require('react-native-webview');
    return <WebView source={source as any} style={style} />;
  } catch (e) {
    return (
      <View style={[styles.webFallback, style]}>
        <Text>WebView native module is not installed or available.</Text>
        {'uri' in source && (
          <Text style={styles.link} onPress={() => Linking.openURL(source.uri)}>
            Open in browser
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webFallback: { padding: 16, alignItems: 'center', justifyContent: 'center' },
  link: { marginTop: 8, color: '#0066cc' },
});
