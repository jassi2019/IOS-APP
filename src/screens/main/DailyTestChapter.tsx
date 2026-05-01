import { useAuth } from '@/contexts/AuthContext';
import { useGetChaptersBySubjectId } from '@/hooks/api/chapters';
import { useGetAllClasses } from '@/hooks/api/classes';
import { getGuestChaptersWithFreeTopics } from '@/constants/guestData';
import { TChapter } from '@/types/Chapter';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DailyTestChapterProps = {
  navigation: any;
  route: {
    params?: {
      subjectId?: string;
      subjectName?: string;
      subjectEmoji?: string;
      classId?: string;
      className?: string;
    };
  };
};

const FILTERS = ['All', 'Recent', 'Favourites', 'Untouched'] as const;
type Filter = typeof FILTERS[number];

export const DailyTestChapter = ({ navigation, route }: DailyTestChapterProps) => {
  const { isGuest } = useAuth();
  const subjectId    = route?.params?.subjectId    || '';
  const subjectName  = route?.params?.subjectName  || 'Subject';
  const subjectEmoji = route?.params?.subjectEmoji || '📘';
  const classId      = route?.params?.classId      || '';
  const className    = route?.params?.className    || 'Class';

  const [filter, setFilter] = useState<Filter>('All');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  const { data, isLoading } = useGetChaptersBySubjectId(
    { subjectId, classId },
    { enabled: !isGuest && Boolean(subjectId && classId) }
  );

  const apiChapters: TChapter[] = data?.data || [];
  const guestChapters: TChapter[] = isGuest
    ? (getGuestChaptersWithFreeTopics(subjectId, classId) as TChapter[])
    : [];
  const allChapters = isGuest ? guestChapters : apiChapters;

  const filteredChapters = (() => {
    if (filter === 'All') return allChapters;
    if (filter === 'Recent') return allChapters.slice(0, 3);
    // Favourites / Untouched — same as All for now; wire to user prefs later
    return allChapters;
  })();

  const selectedChapter = allChapters.find((c) => c.id === selectedChapterId);

  const handleStartTest = () => {
    if (!selectedChapter) return;
    navigation.navigate('TestMCQ', {
      testName: `${subjectName} · ${className}`,
      subjectName,
      subjectEmoji,
      subjectId,
      classId,
      chapterId: selectedChapter.id,
      chapterName: selectedChapter.name,
      chapterNum: String(selectedChapter.number).padStart(2, '0'),
      totalTime: 30 * 60,
    });
  };

  return (
    <LinearGradient
      colors={['#F5A623', '#F9C45A', '#FCDA3E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.safeArea}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        {/* Yellow Header */}
        <View style={styles.yellowSection}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
              <ChevronLeft size={22} color="#111" />
            </TouchableOpacity>
            <Text style={styles.topTitle} numberOfLines={1}>
              {subjectName} · {className}
            </Text>
          </View>

          <View style={styles.stepDots}>
            <View style={[styles.dot, styles.dotDone]} />
            <View style={[styles.dot, styles.dotDone]} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>

          <View style={styles.headerPanel}>
            <Text style={styles.headerGreet}>Step 3 of 3 📖</Text>
            <Text style={styles.headerTitle}>Pick a Chapter</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.bodyCard}>
          {/* Filter pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            style={{ flexGrow: 0 }}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, filter === f && styles.filterPillActive]}
                onPress={() => setFilter(f)}
                activeOpacity={0.85}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Chapter list */}
          {isLoading && !isGuest ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#F5A623" />
            </View>
          ) : filteredChapters.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No chapters found</Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chapterList}
            >
              {filteredChapters.map((ch) => {
                const isSelected = selectedChapterId === ch.id;
                const num = String(ch.number).padStart(2, '0');
                return (
                  <TouchableOpacity
                    key={ch.id}
                    style={[styles.chapterCard, isSelected && styles.chapterCardSelected]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedChapterId(ch.id)}
                  >
                    <LinearGradient
                      colors={['#FFB74D', '#F6C228']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.chNum}
                    >
                      <Text style={styles.chNumText}>{num}</Text>
                    </LinearGradient>
                    <View style={styles.chText}>
                      <Text style={styles.chName} numberOfLines={1}>{ch.name}</Text>
                      <View style={styles.chMeta}>
                        <Text style={styles.chMetaText}>⏱ 30 min</Text>
                      </View>
                    </View>
                    <View style={[styles.chRadio, isSelected && styles.chRadioSelected]}>
                      {isSelected && <Text style={styles.chRadioCheck}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Start Test sticky bar */}
          <View style={styles.startBar}>
            <TouchableOpacity
              style={[styles.startBtn, !selectedChapterId && styles.startBtnDisabled]}
              activeOpacity={selectedChapterId ? 0.85 : 1}
              onPress={handleStartTest}
            >
              <Text style={styles.startBtnText}>
                {selectedChapterId ? 'START TEST' : 'Select a chapter first'}
              </Text>
              {!!selectedChapterId && (
                <View style={styles.startArrow}>
                  <Text style={styles.startArrowText}>→</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  yellowSection: { backgroundColor: 'transparent' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 8,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(146,64,14,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { fontSize: 17, fontWeight: '800', color: '#111', flex: 1 },

  stepDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 8 },
  dot: { width: 22, height: 4, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' },
  dotActive: { backgroundColor: '#111' },
  dotDone: { backgroundColor: '#fff' },

  headerPanel: { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 4 },
  headerGreet: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#111', letterSpacing: -0.3 },

  bodyCard: {
    flex: 1,
    backgroundColor: '#FFF8E8',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 16, paddingTop: 22,
  },

  filterRow: { gap: 8, paddingBottom: 14, alignItems: 'center' },
  filterPill: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#f0f0f0',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  filterPillActive: { backgroundColor: '#111', borderColor: '#111' },
  filterText: { fontSize: 11.5, fontWeight: '700', color: '#555' },
  filterTextActive: { color: '#F6C228' },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 13, color: '#999' },

  chapterList: { gap: 10, paddingBottom: 10 },
  chapterCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 11,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  chapterCardSelected: {
    borderColor: '#F6C228', backgroundColor: '#FFFBEA',
    shadowColor: '#F6C228', shadowOpacity: 0.25, shadowRadius: 18, elevation: 4,
  },
  chNum: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  chNumText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  chText: { flex: 1, minWidth: 0 },
  chName: { fontSize: 13, fontWeight: '800', color: '#111', marginBottom: 3 },
  chMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chMetaText: { fontSize: 10.5, color: '#666' },
  chRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
  },
  chRadioSelected: { backgroundColor: '#F6C228', borderColor: '#F6C228' },
  chRadioCheck: { fontSize: 11, fontWeight: '900', color: '#fff' },

  startBar: {
    paddingVertical: 12, paddingBottom: 18,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)',
  },
  startBtn: {
    backgroundColor: '#1a1a1a', borderRadius: 14, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  startBtnDisabled: { backgroundColor: '#ccc' },
  startBtnText: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  startArrow: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#F6C228', alignItems: 'center', justifyContent: 'center',
  },
  startArrowText: { color: '#111', fontSize: 13, fontWeight: '900' },
});

export default DailyTestChapter;
