import { Header } from '@/components/Header/Header';
import PlatformWebView from '@/components/PlatformWebView';
import { useAuth } from '@/contexts/AuthContext';
import { useGetTopicById } from '@/hooks/api/topics';
import { useContentProtection } from '@/hooks/useContentProtection';
import { isPaidSubscriptionActive, isPremiumServiceType } from '@/lib/subscription';
import { TTopic } from '@/types/Topic';
import React from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TopicContentProps = {
  navigation: any;
  route: {
    params?: {
      topic?: TTopic;
    };
  };
};

export const TopicContent = ({ navigation, route }: TopicContentProps) => {
  const { isGuest, user } = useAuth();
  const topic = route?.params?.topic;
  const topicId = topic?.id || '';
  const isPremiumTopic = isPremiumServiceType(topic?.serviceType);
  const hasPremium = isPaidSubscriptionActive(user?.subscription);

  // Protect lesson content from screenshots / screen recordings (best-effort).
  // NOTE: Web cannot be reliably protected, so keep this native-only.
  useContentProtection({ enabled: Platform.OS !== 'web', key: 'topic-content', appSwitcherBlurIntensity: 0.65 });

  const {
    data: topicResponse,
    isLoading: isLoadingTopic,
    error: topicError,
    refetch,
  } = useGetTopicById(topicId, {
    enabled: !isGuest && !!topicId && (!isPremiumTopic || hasPremium),
    retry: false,
  });

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

  if (!isGuest && isPremiumTopic && !hasPremium) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
        <Header title={topic?.name || 'Topic'} onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
            Premium subscription required
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            Subscribe to unlock premium content.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Plans')}
            style={{
              backgroundColor: '#F4B95F',
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>View Plans</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // For signed-in users, fetch the topic via the protected endpoint.
  // Backend will reject premium topics if the user has no active subscription.
  if (!isGuest) {
    if (isLoadingTopic) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
          <Header title={topic?.name || 'Topic'} onBack={() => navigation.goBack()} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#F4B95F" />
            <Text style={{ marginTop: 12, color: '#6B7280' }}>Loading topic...</Text>
          </View>
        </SafeAreaView>
      );
    }

    if (topicError) {
      const message = String((topicError as any)?.userMessage || (topicError as any)?.message || '');
      const isNotSubscribed = message.toLowerCase().includes('not subscribed');

      if (isNotSubscribed) {
        return (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
            <Header title={topic?.name || 'Topic'} onBack={() => navigation.goBack()} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
                Premium subscription required
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 16, lineHeight: 20 }}>
                Subscribe to unlock premium content.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Plans')}
                style={{
                  backgroundColor: '#F4B95F',
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>View Plans</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      }

      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
          <Header title={topic?.name || 'Topic'} onBack={() => navigation.goBack()} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 16, color: '#EF4444', textAlign: 'center', marginBottom: 12 }}>
              {message || 'Unable to load topic. Please try again.'}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: '#F9FAFB',
              }}
            >
              <Text style={{ fontWeight: '700', color: '#111827' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
  }

  const effectiveTopic = !isGuest ? topicResponse?.data || topic : topic;

  const rawURL = effectiveTopic?.contentURL || '';
  const webViewSource = rawURL.includes('canva.com')
    ? { uri: `${rawURL.split('?')[0]}?embed` }
    : { uri: rawURL };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <Header title={effectiveTopic?.name} onBack={() => navigation.goBack()} />

      <PlatformWebView
        source={webViewSource}
        style={{ flex: 1 }}
        protectedContent={true}
      />
    </SafeAreaView>
  );
};

export default TopicContent;
