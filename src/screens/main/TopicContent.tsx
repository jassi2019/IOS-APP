import { Header } from '@/components/Header/Header';
import { TTopic } from '@/types/Topic';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

type TopicContentProps = {
  navigation: any;
  route: {
    params?: {
      topic?: TTopic;
    };
  };
};

export const TopicContent = ({ navigation, route }: TopicContentProps) => {
  const topic = route?.params?.topic;

  if (!topic) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FDF6F0' }} edges={['top']}>
        <Header title="Error" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#EF4444', textAlign: 'center' }}>
            Topic data not found. Please try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const rawURL = topic?.contentURL || '';
  const webViewSource = rawURL.includes('canva.com')
    ? { uri: `${rawURL.split('?')[0]}?embed` }
    : { uri: rawURL };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <Header title={topic?.name} onBack={() => navigation.goBack()} />

      <WebView
        source={webViewSource}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo
        startInLoadingState
        originWhitelist={['*']}
        mixedContentMode="always"
        allowFileAccess
        allowUniversalAccessFromFileURLs
        renderLoading={() => (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <ActivityIndicator size="large" color="#F4B95F" />
          </View>
        )}
        onError={(e) => console.log('WebView Error:', e)}
        onHttpError={(e) => console.log('HTTP Error:', e)}
        onLoadEnd={() => console.log('Loaded')}
      />
    </SafeAreaView>
  );
};

export default TopicContent;
