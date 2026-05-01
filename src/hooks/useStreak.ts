import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'taiyari_streak_data_v1';

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  totalDaysStudied: number;
  visitedDates: string[];
  lastVisit: string | null;
};

const todayKey = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const yesterdayKey = (d: Date = new Date()) => {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
};

const initialData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalDaysStudied: 0,
  visitedDates: [],
  lastVisit: null,
};

export const useStreak = () => {
  const [data, setData] = useState<StreakData>(initialData);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const stored: StreakData = raw ? JSON.parse(raw) : initialData;

      const today = todayKey();
      const yesterday = yesterdayKey();

      // Backfill totalDaysStudied for users with old saved data
      const storedTotal =
        typeof stored.totalDaysStudied === 'number'
          ? stored.totalDaysStudied
          : stored.visitedDates.length;

      if (stored.lastVisit === today) {
        setData({ ...stored, totalDaysStudied: storedTotal });
        setLoading(false);
        return;
      }

      // Streak resets if a day is missed; total days never resets.
      const isConsecutive = stored.lastVisit === yesterday;
      const isFirstEver = !stored.lastVisit;
      const newCurrent = isFirstEver || !isConsecutive ? 1 : stored.currentStreak + 1;

      const newLongest = Math.max(stored.longestStreak, newCurrent);
      const alreadyVisited = stored.visitedDates.includes(today);
      const visited = alreadyVisited
        ? stored.visitedDates
        : [...stored.visitedDates, today];
      const newTotal = alreadyVisited ? storedTotal : storedTotal + 1;

      const updated: StreakData = {
        currentStreak: newCurrent,
        longestStreak: newLongest,
        totalDaysStudied: newTotal,
        visitedDates: visited,
        lastVisit: today,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setData(updated);
    } catch {
      setData(initialData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, reload: load };
};
