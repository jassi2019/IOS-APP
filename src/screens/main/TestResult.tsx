import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MCQQuestion, AnswerState } from './TestMCQ';

type TestResultProps = {
  navigation: any;
  route: {
    params?: {
      testName?: string;
      subjectName?: string;
      chapterName?: string;
      totalQuestions?: number;
      correct?: number;
      wrong?: number;
      skipped?: number;
      answers?: AnswerState[];
      questions?: MCQQuestion[];
    };
  };
};

type TopicBreakdown = {
  emoji: string;
  name: string;
  correct: number;
  total: number;
};

const TOPIC_EMOJIS = ['⚡', '🔌', '🧲', '🌊', '🔬', '⚗️', '🌿', '🦋'];

const BAR_COLORS = { good: '#43A047', mid: '#F6C228', bad: '#EF5350' };

export const TestResult = ({ navigation, route }: TestResultProps) => {
  const [showReview, setShowReview] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const testName       = route?.params?.testName       || 'Test';
  const subjectName    = route?.params?.subjectName    || '';
  const chapterName    = route?.params?.chapterName    || '';
  const totalQuestions = route?.params?.totalQuestions || 0;
  const correct        = route?.params?.correct  ?? 0;
  const wrong          = route?.params?.wrong    ?? 0;
  const skipped        = route?.params?.skipped  ?? 0;
  const answers        = route?.params?.answers  || [];
  const questions      = route?.params?.questions || [];

  const score = Math.round((correct / Math.max(totalQuestions, 1)) * 100);
  const xpEarned = correct * 4;

  const getTitle = () => {
    if (score >= 80) return 'Excellent Work!';
    if (score >= 60) return 'Good Effort!';
    if (score >= 40) return 'Keep Practicing!';
    return "Don't Give Up!";
  };
  const getSubtitle = () => {
    if (score >= 80) return `You scored higher than 85% students`;
    if (score >= 60) return 'Above average performance';
    if (score >= 40) return 'You can do better with practice';
    return 'Review your notes and try again';
  };
  const getTrophy = () => {
    if (score >= 80) return '🏆';
    if (score >= 60) return '🥈';
    if (score >= 40) return '📚';
    return '💪';
  };
  const getStreakText = () => {
    if (score >= 80) return '7-day streak unlocked! 🔥';
    if (score >= 60) return 'Keep it up! 💪';
    return 'Practice daily to build streak 🎯';
  };

  // Build topic-wise breakdown — group by difficulty as a proxy for topics
  // In production this would come from real question-topic mapping
  const topicMap: Record<string, TopicBreakdown> = {};
  questions.forEach((q, i) => {
    const topicKey = q.difficulty;
    if (!topicMap[topicKey]) {
      const idx = Object.keys(topicMap).length % TOPIC_EMOJIS.length;
      topicMap[topicKey] = {
        emoji: TOPIC_EMOJIS[idx],
        name: topicKey.charAt(0) + topicKey.slice(1).toLowerCase() + ' level',
        correct: 0, total: 0,
      };
    }
    topicMap[topicKey].total += 1;
    if (answers[i]?.selectedIndex === q.correctIndex) topicMap[topicKey].correct += 1;
  });

  // Fallback topic breakdown when no real data
  const topicBreakdown: TopicBreakdown[] = Object.values(topicMap).length > 0
    ? Object.values(topicMap)
    : [
        { emoji: '⚡', name: 'Electric Field',  correct: 9, total: 10 },
        { emoji: '🔌', name: "Coulomb's Law",   correct: 8, total: 10 },
        { emoji: '🧲', name: 'Electric Dipole', correct: 5, total: 5 },
      ];

  const handleRetry = () => {
    navigation.replace('TestMCQ', {
      testName,
      subjectName,
      chapterName,
      totalTime: 30 * 60,
    });
  };

  const handleBack = () => {
    navigation.navigate('MainTabs', { screen: 'TestsTab' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Result</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={['#F5A623', '#FFB74D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.resultHero}
        >
          <Text style={styles.trophy}>{getTrophy()}</Text>
          <Text style={styles.resultTitle}>{getTitle()}</Text>
          <Text style={styles.resultSub}>{getSubtitle()}</Text>
        </LinearGradient>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreBig}>
            {score}<Text style={styles.scoreMax}>/100</Text>
          </Text>
          <Text style={styles.scoreLabel}>YOUR SCORE</Text>
          <View style={styles.scoreStats}>
            <View style={styles.scoreStat}>
              <Text style={[styles.ssVal, { color: '#2E7D32' }]}>{correct}</Text>
              <Text style={styles.ssLbl}>Correct</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={[styles.ssVal, { color: '#C62828' }]}>{wrong}</Text>
              <Text style={styles.ssLbl}>Wrong</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={[styles.ssVal, { color: '#888' }]}>{skipped}</Text>
              <Text style={styles.ssLbl}>Skipped</Text>
            </View>
          </View>
        </View>

        {/* XP Reward Card */}
        <View style={styles.rewardCard}>
          <LinearGradient
            colors={['#FFB74D', '#F6C228']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rewardIcon}
          >
            <Text style={{ fontSize: 20 }}>⭐</Text>
          </LinearGradient>
          <View style={styles.rewardText}>
            <Text style={styles.rewardTitle}>XP Earned</Text>
            <Text style={styles.rewardSub}>{getStreakText()}</Text>
          </View>
          <View style={styles.rewardXp}>
            <Text style={styles.rewardXpText}>+{xpEarned} XP</Text>
          </View>
        </View>

        {/* Topic-wise Breakdown */}
        <View style={styles.breakdown}>
          <Text style={styles.bdTitle}>📊 Topic-wise Performance</Text>
          {topicBreakdown.map((bd, i) => {
            const pct = bd.total > 0 ? Math.round((bd.correct / bd.total) * 100) : 0;
            const barColor = pct >= 80 ? BAR_COLORS.good : pct >= 50 ? BAR_COLORS.mid : BAR_COLORS.bad;
            return (
              <View key={i} style={styles.bdRow}>
                <Text style={styles.bdEmoji}>{bd.emoji}</Text>
                <View style={styles.bdInfo}>
                  <Text style={styles.bdName}>{bd.name}</Text>
                  <View style={styles.bdBar}>
                    <View style={[styles.bdFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                  </View>
                </View>
                <Text style={styles.bdPct}>{bd.correct}/{bd.total}</Text>
              </View>
            );
          })}
        </View>

        {/* Answer Review Section */}
        {questions.length > 0 && (
          <View style={styles.reviewSection}>
            <TouchableOpacity
              style={styles.reviewToggle}
              onPress={() => setShowReview(!showReview)}
              activeOpacity={0.85}
            >
              <Text style={styles.reviewToggleText}>
                {showReview ? '▲ Hide Answer Review' : '📋 Review Answers'}
              </Text>
            </TouchableOpacity>

            {showReview && questions.map((q, i) => {
              const userAns = answers[i]?.selectedIndex;
              const isCorrect = userAns === q.correctIndex;
              const isSkipped = userAns === null;
              return (
                <View key={q.id} style={styles.reviewCard}>
                  <View style={styles.reviewQHeader}>
                    <View style={[
                      styles.reviewStatus,
                      isSkipped ? styles.reviewSkipped : isCorrect ? styles.reviewCorrect : styles.reviewWrong
                    ]}>
                      <Text style={styles.reviewStatusText}>
                        {isSkipped ? 'SKIPPED' : isCorrect ? '✓ CORRECT' : '✗ WRONG'}
                      </Text>
                    </View>
                    <Text style={styles.reviewQNum}>Q{i + 1}</Text>
                  </View>
                  <Text style={styles.reviewQText}>{q.text}</Text>
                  {q.options.map((opt, idx) => {
                    const isUserChoice = userAns === idx;
                    const isRight = q.correctIndex === idx;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.reviewOpt,
                          isRight && styles.reviewOptCorrect,
                          isUserChoice && !isRight && styles.reviewOptWrong,
                        ]}
                      >
                        <Text style={[
                          styles.reviewOptLetter,
                          isRight && { color: '#2E7D32' },
                          isUserChoice && !isRight && { color: '#C62828' },
                        ]}>
                          {opt.letter}
                        </Text>
                        <Text style={[
                          styles.reviewOptText,
                          isRight && { color: '#2E7D32', fontWeight: '800' },
                          isUserChoice && !isRight && { color: '#C62828' },
                        ]}>
                          {opt.text}
                        </Text>
                        {isRight && <Text style={{ fontSize: 12 }}>✓</Text>}
                        {isUserChoice && !isRight && <Text style={{ fontSize: 12 }}>✗</Text>}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.btnOutline} onPress={handleBack} activeOpacity={0.8}>
          <Text style={styles.btnOutlineText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSolid} onPress={handleRetry} activeOpacity={0.8}>
          <Text style={styles.btnSolidText}>Retry →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8E8' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#F5A623',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(146,64,14,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { fontSize: 17, fontWeight: '800', color: '#111' },

  scroll: { paddingBottom: 100 },

  resultHero: {
    paddingTop: 22, paddingBottom: 50, paddingHorizontal: 20, alignItems: 'center',
  },
  trophy: { fontSize: 60, marginBottom: 8 },
  resultTitle: { fontSize: 20, fontWeight: '900', color: '#111', marginBottom: 4 },
  resultSub: { fontSize: 12, color: '#4a3a00', fontWeight: '600' },

  scoreCard: {
    backgroundColor: '#fff', borderRadius: 22, padding: 20,
    marginHorizontal: 16, marginTop: -32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12, shadowRadius: 30, elevation: 8,
    marginBottom: 14,
  },
  scoreBig: {
    fontSize: 50, fontWeight: '900', color: '#F6C228',
    textAlign: 'center', letterSpacing: -2, lineHeight: 58,
  },
  scoreMax: { fontSize: 20, color: '#999', fontWeight: '700' },
  scoreLabel: {
    textAlign: 'center', fontSize: 11, color: '#777',
    fontWeight: '700', letterSpacing: 0.5, marginBottom: 14,
  },
  scoreStats: { flexDirection: 'row', gap: 8 },
  scoreStat: {
    flex: 1, alignItems: 'center', padding: 10,
    backgroundColor: '#FAFAFA', borderRadius: 12,
  },
  ssVal: { fontSize: 17, fontWeight: '900', color: '#111' },
  ssLbl: { fontSize: 9.5, color: '#777', fontWeight: '600', marginTop: 2 },

  // XP reward card
  rewardCard: {
    marginHorizontal: 16, marginBottom: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#FFE082',
    borderRadius: 16, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  rewardIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  rewardText: { flex: 1 },
  rewardTitle: { fontSize: 12.5, fontWeight: '800', color: '#111' },
  rewardSub: { fontSize: 10.5, color: '#777' },
  rewardXp: {
    backgroundColor: '#111', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  rewardXpText: { fontSize: 11.5, fontWeight: '900', color: '#F6C228' },

  breakdown: { paddingHorizontal: 16 },
  bdTitle: { fontSize: 13, fontWeight: '800', color: '#111', marginBottom: 10 },
  bdRow: {
    backgroundColor: '#fff', borderRadius: 14, padding: 10,
    marginBottom: 7, flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  bdEmoji: { fontSize: 20 },
  bdInfo: { flex: 1 },
  bdName: { fontSize: 12, fontWeight: '800', color: '#111', marginBottom: 4 },
  bdBar: { height: 5, borderRadius: 5, backgroundColor: '#f0f0f0', overflow: 'hidden' },
  bdFill: { height: '100%', borderRadius: 5 },
  bdPct: { fontSize: 12, fontWeight: '900', color: '#111' },

  reviewSection: { paddingHorizontal: 16, marginTop: 14 },
  reviewToggle: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#F6C228', marginBottom: 10,
  },
  reviewToggleText: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  reviewCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  reviewQHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  reviewCorrect: { backgroundColor: '#E8F5E9' },
  reviewWrong: { backgroundColor: '#FFEBEE' },
  reviewSkipped: { backgroundColor: '#F5F5F5' },
  reviewStatusText: { fontSize: 9.5, fontWeight: '800', color: '#333' },
  reviewQNum: { fontSize: 10, color: '#999', fontWeight: '700' },
  reviewQText: { fontSize: 12.5, color: '#111', fontWeight: '600', marginBottom: 10, lineHeight: 18 },
  reviewOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 8, borderRadius: 8, marginBottom: 5, backgroundColor: '#FAFAFA',
  },
  reviewOptCorrect: { backgroundColor: '#E8F5E9' },
  reviewOptWrong: { backgroundColor: '#FFEBEE' },
  reviewOptLetter: { fontSize: 12, fontWeight: '900', color: '#555', width: 16 },
  reviewOptText: { flex: 1, fontSize: 11.5, color: '#444', fontWeight: '600' },

  resultActions: {
    flexDirection: 'row', gap: 8, padding: 14, paddingBottom: 18,
    backgroundColor: '#FFF8E8', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)',
  },
  btnOutline: {
    flex: 1, paddingVertical: 13, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e0e0e0',
    alignItems: 'center', justifyContent: 'center',
  },
  btnOutlineText: { fontSize: 13, fontWeight: '800', color: '#555' },
  btnSolid: {
    flex: 1, paddingVertical: 13, borderRadius: 14,
    backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center',
  },
  btnSolidText: { fontSize: 13, fontWeight: '800', color: '#fff' },
});

export default TestResult;
