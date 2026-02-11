import { ContinueReading } from '@/components/ContinueReading/ContinueReading';
import {
  ContinueReadingSkeleton,
  SubjectCardSkeleton,
  TopicCardSkeleton,
} from '@/components/SkeletonLoader/SkeletonLoader';
import SubjectCard from '@/components/SubjectCard/SubjectCard';
import TopicCard from '@/components/TopicCard/TopicCard';
import { useAuth } from '@/contexts/AuthContext';
import {
  getGuestFreeTopics,
  getGuestSubjectsWithFreeTopics,
} from '@/constants/guestData';
import { isPaidSubscriptionActive, isPremiumServiceType } from '@/lib/subscription';
import { useGetChaptersBySubjectId } from '@/hooks/api/chapters';
import { useGetAllClasses } from '@/hooks/api/classes';
import { useGetFavorites } from '@/hooks/api/favorites';
import { useGetAllSubjects } from '@/hooks/api/subjects';
import {
  useGetFreeTopics,
  useGetLastReadTopic,
  useGetTopicsByChapterIdAndSubjectId,
  useMarkTopicAsLastRead,
} from '@/hooks/api/topics';
import { useGetProfile } from '@/hooks/api/user';
import UserHeader from '@/hooks/useHeader';
import { TSubject } from '@/types/Subject';
import { TTopic } from '@/types/Topic';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: any;
};

export const Home = ({ navigation }: HomeScreenProps) => {
  const { isGuest, user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useGetProfile({
    enabled: !isGuest,
  });
  const { data, isLoading: subjectsLoading, error: subjectsError } = useGetAllSubjects({
    enabled: !isGuest,
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const freeTopicsSectionRef = useRef<View>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const { data: classes } = useGetAllClasses({ enabled: !isGuest });
  const { data: chapters } = useGetChaptersBySubjectId(
    {
      subjectId: data?.data?.[0]?.id || '',
      classId: classes?.data?.[0]?.id || '',
    },
    {
      enabled: !isGuest && !!data?.data?.[0]?.id && !!classes?.data?.[0]?.id,
    }
  );
  const {
    data: favoritesData,
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useGetFavorites({ enabled: !isGuest });
  const { data: lastReadTopic, isLoading: lastReadTopicLoading } = useGetLastReadTopic({
    enabled: !isGuest && !!user?.id,
  });
  const { data: freeTopics, isLoading: freeTopicsLoading } = useGetFreeTopics({
    enabled: !isGuest,
  });

  // Get first free topic if no last read topic
  const guestSubjects = getGuestSubjectsWithFreeTopics();
  const guestFreeTopics = getGuestFreeTopics();
  const firstSubject: TSubject | undefined = data?.data?.[0];
  const { data: topics, isLoading: topicsLoading } = useGetTopicsByChapterIdAndSubjectId(
    {
      subjectId: firstSubject?.id || '',
      chapterId: chapters?.data?.[0]?.id || '',
    },
    {
      enabled: !isGuest && !!firstSubject?.id && !!chapters?.data?.[0]?.id,
    }
  );
  const firstFreeTopic: TTopic | undefined = topics?.data?.find(
    (topic: TTopic) => topic.serviceType === 'FREE'
  );

  const guestFreeTopic: TTopic | undefined = guestFreeTopics?.[0];

  const { mutate: markTopicAsLastRead } = useMarkTopicAsLastRead();

  const effectiveSubscription = user?.subscription || profile?.data?.subscription;
  const hasPremium = !isGuest && isPaidSubscriptionActive(effectiveSubscription);

  const canAccessServiceType = (serviceType: unknown) => {
    if (!isPremiumServiceType(serviceType)) return true;

    // Guests cannot buy; signed-in users need an active subscription
    if (isGuest || !hasPremium) {
      setShowPremiumModal(true);
      return false;
    }

    return true;
  };

  const handleSubjectPress = (subject: TSubject) => {
    navigation.navigate('Chapters', {
      subjectId: subject.id,
      subjectTitle: subject.name,
    });
  };

  const handleContinueReading = () => {
    if (!lastReadTopic?.data) return;
    if (!canAccessServiceType(lastReadTopic.data.serviceType)) return;
    navigation.navigate('TopicContent', {
      topic: lastReadTopic.data,
    });
  };

  const handleStartReading = (topic: TTopic) => {
    if (!canAccessServiceType(topic.serviceType)) return;
    // Navigate first, then mark as last read (non-blocking)
    navigation.navigate('TopicContent', {
      topic,
    });
    // Mark as last read in background - if it fails, user can still read
    if (!isGuest) {
      try {
        markTopicAsLastRead(topic.id);
      } catch (error) {
        // Non-critical background task fail
      }
    }
  };

  const handleExploreFreeTopic = () => {
    // Scroll to free topics section
    freeTopicsSectionRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
      },
      () => { }
    );
  };

  const displayName =
    isGuest ? 'Guest' : ((profile?.data?.name?.charAt(0)?.toUpperCase() || '') + (profile?.data?.name?.slice(1) || ''));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserHeader
          name={displayName}
          imageUrl={profile?.data?.profilePicture || ''}
          isPremium={hasPremium}
        />

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitleSmall}>Ab hogi</Text>
          <Text style={styles.welcomeTitleLarge}>Taiyari NEET ki</Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          {!isGuest && (lastReadTopicLoading || (topicsLoading && !lastReadTopic?.data)) ? (
            <ContinueReadingSkeleton />
          ) : !isGuest && lastReadTopic?.data ? (
            <ContinueReading
              title={lastReadTopic.data.name}
              description={lastReadTopic.data.description}
              subject={lastReadTopic.data.Subject.name}
              isPremium={isPremiumServiceType(lastReadTopic.data.serviceType)}
              onPress={handleContinueReading}
            />
          ) : (isGuest ? guestFreeTopic : firstFreeTopic) ? (
            <ContinueReading
              title={(isGuest ? guestFreeTopic : firstFreeTopic)?.name || ''}
              description={(isGuest ? guestFreeTopic : firstFreeTopic)?.description || ''}
              subject={isGuest ? (guestFreeTopic?.Subject?.name || 'Free Topic') : (firstSubject?.name || '')}
              isPremium={isPremiumServiceType((isGuest ? guestFreeTopic : firstFreeTopic)?.serviceType)}
              onPress={() => {
                const topic = isGuest ? guestFreeTopic : firstFreeTopic;
                if (topic) {
                  handleStartReading(topic);
                }
              }}
              isStartReading
            />
          ) : null}
        </View>

        {!isGuest && freeTopicsLoading ? (
          <View style={styles.section}>
            <ContinueReadingSkeleton />
          </View>
        ) : !isGuest && freeTopics?.data?.length ? (
          <View ref={freeTopicsSectionRef} style={styles.section}>
            <Text style={styles.sectionTitle}>Free Topics</Text>
            <View style={styles.cardStack}>
              {freeTopics.data.map((topic: TTopic) => (
                <TopicCard
                  key={topic.id}
                  topicId={topic.id}
                  title={topic.name}
                  description={topic.description}
                  thumbnailUrl={topic.contentThumbnail}
                  isFree={true}
                  onPress={() => handleStartReading(topic)}
                  chapterNumber={topic.Chapter.number}
                  subjectName={topic.Subject.name}
                />
              ))}
            </View>
          </View>
        ) : isGuest && guestFreeTopics.length ? (
          <View ref={freeTopicsSectionRef} style={styles.section}>
            <Text style={styles.sectionTitle}>Free Topics</Text>
            <View style={styles.cardStack}>
              {guestFreeTopics.map((topic: TTopic) => (
                <TopicCard
                  key={topic.id}
                  topicId={topic.id}
                  title={topic.name}
                  description={topic.description}
                  thumbnailUrl={topic.contentThumbnail}
                  isFree={true}
                  onPress={() => handleStartReading(topic)}
                  chapterNumber={topic.Chapter.number}
                  subjectName={topic.Subject.name}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Subjects</Text>
          <View style={styles.subjectGrid}>
            {isGuest ? (
              guestSubjects.slice(0, 4).map((subject: TSubject) => (
                <View key={subject.id} style={styles.gridItem}>
                  <SubjectCard subject={subject} onPress={() => handleSubjectPress(subject)} />
                </View>
              ))
            ) : subjectsLoading ? (
              [...Array(4)].map((_, index) => (
                <View key={`skeleton-${index}`} style={styles.gridItem}>
                  <SubjectCardSkeleton />
                </View>
              ))
            ) : subjectsError ? (
              <View>
                <Text style={styles.errorText}>{subjectsError.message}</Text>
              </View>
            ) : data?.data?.length ? (
              data?.data?.slice(0, 4).map((subject: TSubject) => (
                <View key={subject.id} style={styles.gridItem}>
                  <SubjectCard subject={subject} onPress={() => handleSubjectPress(subject)} />
                </View>
              ))
            ) : (
              <View>
                <Text style={styles.emptyText}>No subjects found</Text>
              </View>
            )}
          </View>
        </View>

        {!isGuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Favorites</Text>
            <View style={styles.cardStack}>
              {favoritesLoading ? (
                [...Array(4)].map((_, index) => <TopicCardSkeleton key={`skeleton-${index}`} />)
              ) : favoritesError ? (
                <View>
                  <Text style={styles.errorText}>{favoritesError?.message}</Text>
                </View>
              ) : !favoritesData?.data?.length ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyCardTitle}>No favorites yet</Text>
                  <Text style={styles.emptyCardSubtitle}>
                    Browse topics and bookmark your favorites to see them here
                  </Text>
                </View>
              ) : (
                favoritesData?.data?.slice(0, 4).map((favorite: any) => (
                  <TopicCard
                    topicId={favorite.Topic.id}
                    key={favorite.Topic.id}
                    title={favorite.Topic.name}
                    description={favorite.Topic.description}
                    favoriteId={favorite.id}
                    thumbnailUrl={favorite.Topic.contentThumbnail}
                    isFree={favorite.Topic.serviceType === 'FREE'}
                    onPress={() => handleStartReading(favorite.Topic)}
                    isFavorite={true}
                    chapterNumber={favorite.Topic.Chapter.number}
                    subjectName={favorite.Topic.Subject.name}
                  />
                ))
              )}
            </View>
          </View>
        )}

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
                      : 'Access premium content with a premium subscription.'}
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
                    <Text style={styles.upgradeText}>
                      {isGuest ? 'Go to Profile' : 'Upgrade To Pro'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF6F0', // Consistent with registration screens
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 32,
  },
  welcomeTitleSmall: {
    fontSize: 33,
    fontWeight: '700',
    color: '#333',
    letterSpacing: -1,
    lineHeight: 50,
  },
  welcomeTitleLarge: {
    fontSize: 33,
    fontWeight: '700',
    color: '#F1BB3E',
    letterSpacing: -1,
    lineHeight: 50,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  cardStack: {
    gap: 16,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 56) / 2, // 20px padding * 2 = 40, 16px gap = 56
    marginTop: 16,
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyCardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 380,
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
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#F4B95F',
    borderRadius: 10,
    paddingVertical: 12,
  },
  upgradeText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Home;
