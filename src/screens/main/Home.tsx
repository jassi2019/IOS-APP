import { FeatureDetailModal, FeatureDetail } from '@/components/FeatureDetailModal/FeatureDetailModal';
import { NotificationsModal } from '@/components/NotificationsModal/NotificationsModal';
import { StreakCalendar } from '@/components/StreakCalendar/StreakCalendar';
import { useAuth } from '@/contexts/AuthContext';
import { useFeature } from '@/contexts/FeatureContext';
import { useGetProfile } from '@/hooks/api/user';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { useGetHomeContent } from '@/hooks/api/homecontent';
import { useContentProtection } from '@/hooks/useContentProtection';
import type { TFeatureType } from '@/hooks/api/topics';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const heroBanner = require('../../../assets/hero-banner.jpg');
const avatarLogo = require('../../../assets/icon.png');
const footerImage = require('../../../assets/footer.png');

const { width } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: any;
};

type DefaultFeature = {
  icon: string;
  num: string;
  name: string;
  desc: string;
  featureType: TFeatureType;
};

const DEFAULT_FEATURES: DefaultFeature[] = [
  { icon: '💡', num: '1.', name: 'Explanation', desc: 'Detailed explanation of every topic', featureType: 'explanation' },
  { icon: '🧠', num: '2.', name: 'Revision Recall Station', desc: 'Smart revision to retain better', featureType: 'revision_recall' },
  { icon: '🔗', num: '3.', name: 'Hidden Links', desc: 'Connect concepts unlock clarity', featureType: 'hidden_links' },
  { icon: '📋', num: '4.', name: 'Exercise Revival', desc: 'From Back exercise to Mastery', featureType: 'exercise_revival' },
  { icon: '🏆', num: '5.', name: 'Master Exemplar', desc: 'Exemplar Deep Practice Zone', featureType: 'master_exemplar' },
  { icon: '📖', num: '6.', name: 'Previous Year Questions', desc: 'PYQ to Question Mastery', featureType: 'pyq' },
  { icon: '🛡️', num: '7.', name: 'Chapter Check Point', desc: 'Full chapter test to check your real preparation', featureType: 'chapter_checkpoint' },
];

// Map admin-configured titles back to a feature type, so admin can rename freely
// while we still know which content slot to load.
const FEATURE_TYPE_BY_INDEX: TFeatureType[] = [
  'explanation',
  'revision_recall',
  'hidden_links',
  'exercise_revival',
  'master_exemplar',
  'pyq',
  'chapter_checkpoint',
];

const DEFAULT_TESTS = [
  { icon: '📅', name: 'Daily Practice Test', desc: 'Everyday concept strengthening', bg: '#E8F5E9', btn: '#2E7D32' },
  { icon: '📊', name: 'Weekly Test', desc: 'Revision + performance tracking', bg: '#E3F2FD', btn: '#1565C0' },
  { icon: '📄', name: 'Full Syllabus Test', desc: 'Real exam simulation', bg: '#F3E5F5', btn: '#6A1B9A' },
];

export const Home = ({ navigation }: HomeScreenProps) => {
  const { isGuest } = useAuth();
  const { data: profile } = useGetProfile({ enabled: !isGuest });
  const { data: homeContent, isSuccess: homeContentLoaded } = useGetHomeContent();

  const FEATURES = useMemo(() => {
    // Trust API once it has responded — empty array means admin hid them all.
    if (homeContentLoaded && Array.isArray(homeContent?.data)) {
      const apiFeatures = homeContent.data
        .filter((i: any) => i.section === 'feature' && i.isActive !== false);
      return apiFeatures.map((f: any, i: number) => ({
        icon: f.icon || '📚',
        num: `${i + 1}.`,
        name: f.title,
        desc: f.description || '',
        // Position-based mapping: admin's nth feature card opens nth content slot.
        featureType: FEATURE_TYPE_BY_INDEX[i] ?? 'explanation',
      }));
    }
    // Show defaults only while API hasn't loaded yet (offline / first paint).
    return DEFAULT_FEATURES;
  }, [homeContent, homeContentLoaded]);

  const TESTS = useMemo(() => {
    if (homeContentLoaded && Array.isArray(homeContent?.data)) {
      const apiTests = homeContent.data
        .filter((i: any) => i.section === 'test' && i.isActive !== false);
      return apiTests.map((t: any) => ({
        icon: t.icon || '📋',
        name: t.title,
        desc: t.description || '',
        bg: t.bgColor || '#E8F5E9',
        btn: t.btnColor || '#2E7D32',
      }));
    }
    return DEFAULT_TESTS;
  }, [homeContent, homeContentLoaded]);

  const displayName = isGuest
    ? 'Future Doctor'
    : profile?.data?.name
      ? profile.data.name.charAt(0).toUpperCase() + profile.data.name.slice(1)
      : 'Future Doctor';

  const goToFreeContent = () => {
    navigation.navigate('MainTabs', { screen: 'SubjectsTab' });
  };

  useContentProtection({ key: 'home-screen' });

  const { setActiveFeature: setActiveFeatureType } = useFeature();
  const { currentStreak, longestStreak, visitedDates, totalDaysStudied } = useStreak();
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<(FeatureDetail & { featureType?: TFeatureType }) | null>(null);

  const handleFeatureStart = () => {
    if (activeFeature?.featureType) {
      setActiveFeatureType(activeFeature.featureType);
    }
    setActiveFeature(null);
    navigation.navigate('MainTabs', { screen: 'SubjectsTab' });
  };

  const { completedTopics } = useProgress();
  const studyStats = useMemo(() => {
    const covered = completedTopics.length;
    // Each topic counts as ~10 min of study time (rough estimate)
    const totalMinutes = covered * 10;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const studyTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    // Accuracy is a placeholder (no test data yet) — show "—" until tests are added.
    return {
      covered,
      studyTime,
      hasData: covered > 0,
    };
  }, [completedTopics]);

  return (
    <LinearGradient
      colors={['#F5A623', '#F9C45A', '#FCDA3E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientWrapper}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        contentContainerStyle={{ backgroundColor: 'transparent' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Yellow Header */}
        <View style={styles.yellowHeader}>
          <View style={styles.topNav}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setNotifOpen(true)}
              activeOpacity={0.85}
            >
              <Bell size={20} color="#000" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Greeting Strip */}
          <View style={styles.greetStrip}>
            <View style={styles.greetLeft}>
              <Image source={avatarLogo} style={styles.greetAvatar} resizeMode="contain" />
              <View>
                <Text style={styles.greetHi}>Namaste! 👋</Text>
                <Text style={styles.greetName}>{displayName}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.streakBadge}
              onPress={() => setStreakModalOpen(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.streakText}>🔥 {currentStreak} Day Streak</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Banner */}
          <TouchableOpacity
            style={styles.hero}
            activeOpacity={0.9}
            onPress={goToFreeContent}
          >
            <Image source={heroBanner} style={styles.heroBannerImg} />
          </TouchableOpacity>
        </View>

        {/* White Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.scrollContent}>
          {/* 8 Features */}
          <View style={styles.section}>
            <View style={styles.featGrid}>
              {FEATURES.map((f, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.featCard}
                  activeOpacity={0.7}
                  onPress={() => setActiveFeature(f)}
                >
                  <Text style={styles.featIco} selectable={false}>{f.icon}</Text>
                  <Text style={styles.featNum} selectable={false}>{f.num} {f.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3 Levels of Test */}
          <View style={styles.section}>
            <View style={styles.secRow}>
              <View style={styles.secTitleWrap}>
                <Text style={styles.pulseIcon}>〰</Text>
                <Text style={styles.secTitle}>Challenge Your Knowledge</Text>
              </View>
            </View>
            <View style={styles.testGrid}>
              {TESTS.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.testCard, { backgroundColor: t.bg }]}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('MainTabs', { screen: 'TestsTab' })}
                >
                  <Text style={styles.tIco}>{t.icon}</Text>
                  <Text style={styles.tName}>{t.name}</Text>
                  <Text style={styles.tDesc}>{t.desc}</Text>
                  <View style={[styles.tBtn, { backgroundColor: t.btn }]}>
                    <Text style={styles.tBtnText}>→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Study Progress */}
          <View style={styles.section}>
            <View style={styles.secRow}>
              <Text style={styles.secTitle}>Your Study Progress</Text>
            </View>
            <View style={styles.progGrid}>
              <TouchableOpacity style={styles.progCard} activeOpacity={0.85} onPress={goToFreeContent}>
                <Text style={styles.pIco}>📖</Text>
                <Text style={styles.pLabel}>Topics Covered</Text>
                <Text style={styles.pVal}>{studyStats.covered}</Text>
                <Text style={styles.pSub}>
                  {studyStats.hasData ? 'lessons read' : 'start learning'}
                </Text>
                <View style={styles.pBar}>
                  <View
                    style={[
                      styles.pFill,
                      {
                        backgroundColor: '#EF5350',
                        width: studyStats.hasData ? '100%' : '0%',
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.progCard} activeOpacity={0.85} onPress={goToFreeContent}>
                <Text style={styles.pIco}>🔥</Text>
                <Text style={styles.pLabel}>Day Streak</Text>
                <Text style={styles.pVal}>{currentStreak}</Text>
                <Text style={[styles.pSub, currentStreak > 0 && styles.pSubOk]}>
                  {currentStreak > 0 ? 'Keep it up!' : 'start today'}
                </Text>
                <View style={styles.pBar}>
                  <View
                    style={[
                      styles.pFill,
                      {
                        backgroundColor: '#43A047',
                        width: `${Math.min(currentStreak * 10, 100)}%`,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.progCard} activeOpacity={0.85} onPress={goToFreeContent}>
                <Text style={styles.pIco}>🕐</Text>
                <Text style={styles.pLabel}>Study Time</Text>
                <Text style={[styles.pVal, { fontSize: 16 }]}>{studyStats.studyTime}</Text>
                <Text style={styles.pSub}>{studyStats.hasData ? 'total' : 'no time yet'}</Text>
                <View style={styles.pBar}>
                  <View
                    style={[
                      styles.pFill,
                      {
                        backgroundColor: '#92400E',
                        width: studyStats.hasData ? '100%' : '0%',
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={goToFreeContent} style={styles.footerWrap}>
            <Image source={footerImage} style={styles.footerImg} />
          </TouchableOpacity>
          <View style={{ height: 20, backgroundColor: '#fff' }} />
      </View>
      </ScrollView>

      <StreakCalendar
        visible={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        visitedDates={visitedDates}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalDaysStudied={totalDaysStudied}
      />

      <NotificationsModal
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

      <FeatureDetailModal
        visible={activeFeature !== null}
        feature={activeFeature}
        onClose={() => setActiveFeature(null)}
        onStart={handleFeatureStart}
      />
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientWrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  yellowHeader: {
    paddingBottom: 0,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
  },
  iconBtn: { padding: 4 },
  bellBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(146,64,14,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#92400E',
  },
  greetStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  greetLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greetAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  greetHi: { fontSize: 12, fontWeight: '600', color: '#555' },
  greetName: { fontSize: 15, fontWeight: '800', color: '#111' },
  streakBadge: {
    backgroundColor: '#92400E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#92400E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  streakText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  hero: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginHorizontal: 14,
    marginBottom: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  heroBannerImg: {
    width: width - 28,
    height: ((width - 28) * 709) / 1600,
    borderRadius: 14,
    resizeMode: 'stretch',
    backgroundColor: '#FCD34D',
  },
  cardBody: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 0,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  scrollContent: { paddingTop: 18, paddingHorizontal: 14, paddingBottom: 0 },
  section: { paddingBottom: 18 },
  secRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  secTitle: { fontSize: 14, fontWeight: '800', color: '#111' },
  pulseIcon: { color: '#92400E', fontSize: 15, fontWeight: '800' },
  viewAll: { fontSize: 11.5, fontWeight: '700', color: '#92400E' },

  /* Feature Grid */
  featGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featCard: {
    width: (width - 28 - 24) / 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#efefef',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 1,
  },
  featIco: { fontSize: 24, marginBottom: 6 },
  featNum: {
    fontSize: 9,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 3,
  },
  featDesc: { fontSize: 8, color: '#777', textAlign: 'center', lineHeight: 11 },

  /* Test Grid */
  testGrid: { flexDirection: 'row', gap: 9 },
  testCard: {
    flex: 1,
    borderRadius: 14,
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 42,
    minHeight: 130,
  },
  tIco: { fontSize: 28, marginBottom: 7 },
  tName: { fontSize: 10.5, fontWeight: '800', color: '#111', marginBottom: 3, lineHeight: 13 },
  tDesc: { fontSize: 8.5, color: '#555', lineHeight: 11 },
  tBtn: {
    position: 'absolute',
    bottom: 9,
    right: 9,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tBtnText: { color: '#fff', fontSize: 13, fontWeight: '900' },

  /* Progress Grid */
  progGrid: { flexDirection: 'row', gap: 9 },
  progCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#efefef',
    borderRadius: 14,
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 1,
  },
  pIco: { fontSize: 20, marginBottom: 5 },
  pLabel: { fontSize: 8.5, color: '#888', fontWeight: '600', marginBottom: 3 },
  pVal: { fontSize: 19, fontWeight: '900', color: '#111', marginBottom: 2 },
  pSub: { fontSize: 8, color: '#aaa', marginBottom: 7 },
  pSubOk: { color: '#2E7D32', fontWeight: '700' },
  pBar: { height: 4, borderRadius: 4, backgroundColor: '#eee', overflow: 'hidden' },
  pFill: { height: '100%', borderRadius: 4 },

  /* Quick Actions */
  quickRow: { gap: 10, paddingBottom: 6 },
  qItem: { alignItems: 'center', gap: 5, minWidth: 56 },
  qBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F9C45A',
    borderWidth: 1.5,
    borderColor: '#f0e5b0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qLabel: { fontSize: 9, color: '#444', fontWeight: '600', textAlign: 'center', lineHeight: 12 },

  /* Footer */
  footerWrap: {
    backgroundColor: '#fff',
    marginBottom: 0,
    overflow: 'hidden',
  },
  footerImg: {
    width: width,
    height: (width * 529) / 1504,
    resizeMode: 'stretch',
    marginBottom: 0,
  },
});

export default Home;
