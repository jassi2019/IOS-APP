import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  visitedDates: string[];
  currentStreak: number;
  longestStreak: number;
  totalDaysStudied: number;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const dateKey = (y: number, m: number, d: number) => {
  const mm = String(m + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
};

export const StreakCalendar = ({
  visible,
  onClose,
  visitedDates,
  currentStreak,
  longestStreak,
  totalDaysStudied,
}: Props) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const visitedSet = useMemo(() => new Set(visitedDates), [visitedDates]);

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>🔥 Your Streak</Text>
                  <Text style={styles.subtitle}>Keep showing up daily!</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{currentStreak}</Text>
                  <Text style={styles.statLabel}>Current Streak</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{longestStreak}</Text>
                  <Text style={styles.statLabel}>Longest Streak</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{totalDaysStudied}</Text>
                  <Text style={styles.statLabel}>Total Days Studied</Text>
                </View>
              </View>

              {/* Month Header */}
              <View style={styles.monthRow}>
                <TouchableOpacity onPress={goPrev} style={styles.navBtn}>
                  <ChevronLeft size={20} color="#111" />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </Text>
                <TouchableOpacity onPress={goNext} style={styles.navBtn}>
                  <ChevronRight size={20} color="#111" />
                </TouchableOpacity>
              </View>

              {/* Week days */}
              <View style={styles.weekRow}>
                {WEEK_DAYS.map((d, i) => (
                  <Text key={i} style={styles.weekDay}>{d}</Text>
                ))}
              </View>

              {/* Calendar grid */}
              <View style={styles.grid}>
                {days.map((d, i) => {
                  if (d === null) {
                    return <View key={i} style={styles.cell} />;
                  }
                  const k = dateKey(viewYear, viewMonth, d);
                  const isVisited = visitedSet.has(k);
                  const isToday = k === todayKey;
                  return (
                    <View key={i} style={styles.cell}>
                      <View
                        style={[
                          styles.dayCircle,
                          isVisited && styles.dayVisited,
                          isToday && styles.dayToday,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isVisited && styles.dayTextVisited,
                            isToday && styles.dayTextToday,
                          ]}
                        >
                          {d}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#92400E' }]} />
                  <Text style={styles.legendText}>Streak day</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#fff', borderWidth: 2, borderColor: '#111' }]} />
                  <Text style={styles.legendText}>Today</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  title: { fontSize: 20, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 12, color: '#777', marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f3f3f3',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#111' },
  statLabel: { fontSize: 10, color: '#777', fontWeight: '600', marginTop: 2 },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f6f6f6',
    alignItems: 'center', justifyContent: 'center',
  },
  monthText: { fontSize: 15, fontWeight: '700', color: '#111' },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayCircle: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dayVisited: { backgroundColor: '#92400E' },
  dayToday: { borderWidth: 2, borderColor: '#111' },
  dayText: { fontSize: 13, color: '#444', fontWeight: '600' },
  dayTextVisited: { color: '#fff', fontWeight: '800' },
  dayTextToday: { fontWeight: '900', color: '#111' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 11, color: '#666', fontWeight: '600' },
});

export default StreakCalendar;
