import React from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';

type Props = {
  source: { uri: string } | { html: string };
  style?: any;
  /**
   * Best-effort content protection for sensitive pages:
   * - Disables screenshots/screen recording at the screen level (see `useContentProtection`).
   * - Disables basic copy/select/context menu inside the WebView via injected JS.
   * - Blocks obvious download/navigation attempts.
   */
  protectedContent?: boolean;
};

const shouldBlockNavigation = (url: string): boolean => {
  const lower = String(url || '').toLowerCase();
  const clean = lower.split('#')[0].split('?')[0];

  // Block common file downloads.
  const blockedExts = [
    '.pdf',
    '.zip',
    '.rar',
    '.7z',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.xls',
    '.xlsx',
  ];
  if (blockedExts.some((ext) => clean.endsWith(ext))) return true;

  // Heuristics for download/attachment endpoints.
  if (lower.includes('download=')) return true;
  if (lower.includes('/download')) return true;
  if (lower.includes('attachment')) return true;

  return false;
};

const PROTECT_JS = `
(function () {
  try {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '*{ -webkit-user-select:none !important; user-select:none !important; -webkit-touch-callout:none !important; }';
    document.documentElement.appendChild(style);

    document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, { capture: true });
    document.addEventListener('copy', function (e) { e.preventDefault(); }, { capture: true });
    document.addEventListener('cut', function (e) { e.preventDefault(); }, { capture: true });
    document.addEventListener('paste', function (e) { e.preventDefault(); }, { capture: true });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); }, { capture: true });
  } catch (e) {}
  true;
})();`;

export default function PlatformWebView({ source, style, protectedContent }: Props) {
  if (Platform.OS === 'web') {
    // For web, render an iframe for uri sources, or simple HTML wrapper for html
    if ('uri' in source) {
      return (
        <iframe
          src={source.uri}
          style={{ width: '100%', height: '100%', border: 'none', ...(style || {}) }}
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

    return (
      <WebView
        source={source as any}
        style={style}
        javaScriptEnabled={true}
        injectedJavaScriptBeforeContentLoaded={protectedContent ? PROTECT_JS : undefined}
        injectedJavaScript={protectedContent ? PROTECT_JS : undefined}
        setSupportMultipleWindows={false}
        allowsLinkPreview={false}
        onFileDownload={protectedContent ? () => Alert.alert('Download blocked', 'Downloads are disabled.') : undefined}
        onShouldStartLoadWithRequest={
          protectedContent
            ? (req: any) => {
                const url = String(req?.url || '');
                if (shouldBlockNavigation(url)) {
                  Alert.alert('Blocked', 'Downloads are disabled.');
                  return false;
                }
                return true;
              }
            : undefined
        }
      />
    );
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
