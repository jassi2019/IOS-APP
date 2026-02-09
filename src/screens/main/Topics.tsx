import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/Header/Header';
import TopicCard from '@/components/TopicCard/TopicCard';
import { getGuestTopicsByChapterAndSubject } from '@/constants/guestData';
import { useAuth } from '@/contexts/AuthContext';
import { useGetFavorites } from '@/hooks/api/favorites';
import { useGetTopicsByChapterIdAndSubjectId } from '@/hooks/api/topics';
import { isPaidSubscriptionActive, isPremiumServiceType } from '@/lib/subscription';
import { TTopic } from '@/types/Topic';

// =====================
// Navigation Props (ID-based)
// =====================
type TopicsScreenProps = {
  navigation: any;
  route: {
    params?: {
      chapterId?: string;
      subjectId?: string;
      chapterTitle?: string;
      subjectTitle?: string;
      chapterNumber?: number;
    };
  };
};

// =====================
// Screen Component with Defensive Fallbacks
// =====================
const Topics = ({ navigation, route }: TopicsScreenProps) => {
  // ✅ ID-based navigation - Extract IDs safely
  const chapterId = route?.params?.chapterId;
  const subjectId = route?.params?.subjectId;
  const chapterTitle = route?.params?.chapterTitle || 'Topics';
  const subjectTitle = route?.params?.subjectTitle;
  const chapterNumber = route?.params?.chapterNumber;

  const { isGuest, user } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // ✅ Defensive fallback - Guard against missing params
  if (!chapterId || !subjectId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Error" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Missing chapter or subject information</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Fetch data using IDs
  const { data, isLoading, error } = useGetTopicsByChapterIdAndSubjectId(
    { chapterId, subjectId },
    { enabled: !isGuest }
  );
  const { data: favoritesData, isLoading: favoritesLoading } = useGetFavorites({
    enabled: !isGuest,
  });

  const topicsList = isGuest
    ? getGuestTopicsByChapterAndSubject(chapterId, subjectId)
    : data?.data || [];

  const handleTopicPress = (topic: TTopic) => {
    if (isPremiumServiceType(topic.serviceType)) {
      // Guests can't purchase; signed-in users need an active subscription
      if (isGuest || !isPaidSubscriptionActive(user?.subscription)) {
        setShowPremiumModal(true);
        return;
      }
    }

    navigation.navigate('TopicContent', { topic });
  };

  const getFavoriteTopicId = (topicId: TTopic['id']) => {
    const favorite = favoritesData?.data?.find((each: any) => each.Topic.id === topicId);
    return favorite?.id;
  };

  // ✅ Loading state with proper UI
  if (!isGuest && (isLoading || favoritesLoading)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={chapterTitle} onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F4B95F" />
          <Text style={styles.loadingText}>Loading topics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Error state with retry option
  if (!isGuest && error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={chapterTitle} onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Unable to load topics</Text>
          <Text style={styles.errorSubtext}>
            {error?.message || 'Please check your connection and try again'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Empty state with helpful message
  if (!topicsList.length) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={chapterTitle} onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No Topics Found</Text>
          <Text style={styles.emptySubtext}>This chapter doesn't have any topics yet</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Main UI - Success state
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={chapterTitle} onBack={() => navigation.goBack()} />

      <FlatList
        data={topicsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item: topic }) => (
          <TopicCard
            topicId={topic.id}
            title={topic.name || 'Untitled Topic'}
            favoriteId={getFavoriteTopicId(topic.id)}
            description={topic.description || 'No description available'}
            thumbnailUrl={topic.contentThumbnail}
            isFree={topic.serviceType === 'FREE'}
            onPress={() => handleTopicPress(topic)}
            isFavorite={!!getFavoriteTopicId(topic.id)}
            chapterNumber={chapterNumber || undefined}
            subjectName={subjectTitle || undefined}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent
        visible={showPremiumModal}
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPremiumModal(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>
                  {isGuest ? 'Sign in required' : "You don't have a premium subscription!"}
                </Text>

                <Text style={styles.modalBody}>
                  {isGuest
                    ? 'Sign in to subscribe and access premium content.'
                    : 'Access premium content with a premium subscription'}
                </Text>

                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => {
                    setShowPremiumModal(false);
                    if (isGuest) {
                      navigation.navigate('MainTabs', { screen: 'ProfileTab' });
                    } else {
                      navigation.navigate('Plans');
                    }
                  }}
                >
                  <Text style={styles.upgradeText}>{isGuest ? 'Go to Profile' : 'Upgrade To Pro'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

// =====================
// Styles
// =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF6F0',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: '#F4B95F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBody: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#F4B95F',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  upgradeText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Topics;

