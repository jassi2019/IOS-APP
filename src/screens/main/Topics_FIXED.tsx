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
import { useAuth } from '@/contexts/AuthContext';
import { useGetFavorites } from '@/hooks/api/favorites';
import { useGetTopicsByChapterIdAndSubjectId, useMarkTopicAsLastRead } from '@/hooks/api/topics';
import { TTopic } from '@/types/Topic';

// =====================
// Navigation Props
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
// Screen Component
// =====================
const Topics = ({ navigation, route }: TopicsScreenProps) => {
  // Guard route params
  const chapterId = route?.params?.chapterId;
  const subjectId = route?.params?.subjectId;
  const chapterTitle = route?.params?.chapterTitle || 'Topics';
  const subjectTitle = route?.params?.subjectTitle;
  const chapterNumber = route?.params?.chapterNumber;

  if (!chapterId || !subjectId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Error" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Invalid chapter data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, error } = useGetTopicsByChapterIdAndSubjectId({ chapterId, subjectId });
  const { data: favoritesData, isLoading: favoritesLoading } = useGetFavorites();
  const { mutate: markTopicAsLastRead } = useMarkTopicAsLastRead();

  const handleTopicPress = (topic: TTopic) => {
    if (topic.serviceType === 'PREMIUM' && !user?.subscription) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate('TopicContent', { topic });
    }
  };

  const getFavoriteTopicId = (topicId: TTopic['id']) => {
    const favorite = favoritesData?.data?.find((each: any) => each.Topic.id === topicId);
    return favorite?.id;
  };

  // =====================
  // Loading State
  // =====================
  if (isLoading || favoritesLoading) {
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

  // =====================
  // Error State
  // =====================
  if (error) {
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

  // =====================
  // Empty State
  // =====================
  if (!data?.data?.length) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={chapterTitle} onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No Topics Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // =====================
  // Main UI with FlatList
  // =====================
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={chapterTitle} onBack={() => navigation.goBack()} />

      <FlatList
        data={data.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item: topic }) => (
          <TopicCard
            topicId={topic.id}
            title={topic.name}
            favoriteId={getFavoriteTopicId(topic.id)}
            description={topic.description}
            thumbnailUrl={topic.contentThumbnail}
            isFree={topic.serviceType === 'FREE'}
            onPress={() => handleTopicPress(topic)}
            isFavorite={!!getFavoriteTopicId(topic.id)}
            chapterNumber={chapterNumber}
            subjectName={subjectTitle}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <NoSubscriptionAlertModal
        showPremiumModal={showPremiumModal}
        setShowPremiumModal={setShowPremiumModal}
        onPress={() => {
          setShowPremiumModal(false);
          navigation.navigate('Plans');
        }}
      />
    </SafeAreaView>
  );
};

// =====================
// Premium Modal
// =====================
export const NoSubscriptionAlertModal = ({
  showPremiumModal,
  setShowPremiumModal,
  onPress,
}: {
  showPremiumModal: boolean;
  setShowPremiumModal: (value: boolean) => void;
  onPress: () => void;
}) => (
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
            <Text style={styles.modalTitle}>You don't have premium subscription!</Text>

            <Text style={styles.modalBody}>Access premium content with premium subscription</Text>

            <TouchableOpacity style={styles.upgradeButton} onPress={onPress}>
              <Text style={styles.upgradeText}>Upgrade To Pro</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

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
    fontSize: 16,
    color: '#6B7280',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: { backgroundColor: '#fff', width: '85%', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  modalBody: { color: '#6B7280', textAlign: 'center', marginBottom: 16 },
  upgradeButton: {
    backgroundColor: '#F4B95F',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  upgradeText: { textAlign: 'center', fontSize: 16, fontWeight: '600' },
});

export default Topics;
