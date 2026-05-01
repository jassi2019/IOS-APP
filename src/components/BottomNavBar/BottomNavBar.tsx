import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ClipboardList, Home, Notebook, Plus, User } from 'lucide-react-native';
import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TabName = 'Home' | 'Library' | 'Tests' | 'Profile';

type BottomNavContextType = {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
};

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export const useBottomNav = () => {
  const context = useContext(BottomNavContext);
  if (!context) {
    throw new Error('useBottomNav must be used within a BottomNavProvider');
  }
  return context;
};

export const BottomNavProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Home');

  return (
    <BottomNavContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </BottomNavContext.Provider>
  );
};

type NavItem = {
  icon: typeof Home;
  routeName: string;
  label: string;
};

const NAV_ITEMS_LEFT: NavItem[] = [
  { icon: Home, routeName: 'HomeTab', label: 'Home' },
  { icon: Notebook, routeName: 'SubjectsTab', label: 'Library' },
];

const NAV_ITEMS_RIGHT: NavItem[] = [
  { icon: ClipboardList, routeName: 'TestsTab', label: 'Tests' },
  { icon: User, routeName: 'ProfileTab', label: 'Profile' },
];

export const BottomNav = ({ state, navigation }: BottomTabBarProps) => {
  const currentRouteName = state.routes[state.index]?.name;

  const handlePress = (routeName: string) => {
    if (currentRouteName === routeName) return;
    navigation.navigate(routeName);
  };

  const renderItem = (item: NavItem) => {
    const isActive = currentRouteName === item.routeName;
    return (
      <TouchableOpacity
        key={item.routeName}
        onPress={() => handlePress(item.routeName)}
        activeOpacity={0.7}
        style={styles.tabButton}
      >
        <item.icon
          size={22}
          color={isActive ? '#92400E' : '#9CA3AF'}
          strokeWidth={isActive ? 2.2 : 1.8}
          fill="none"
        />
        <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {NAV_ITEMS_LEFT.map(renderItem)}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handlePress('LibraryTab')}
        style={[styles.fab, currentRouteName === 'LibraryTab' && styles.fabActive]}
      >
        <Plus size={24} color="#fff" strokeWidth={3} />
      </TouchableOpacity>

      {NAV_ITEMS_RIGHT.map(renderItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  labelActive: { color: '#92400E' },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#92400E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#92400E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: 4,
  },
  fabActive: {
    backgroundColor: '#F6C228',
  },
});

export default BottomNav;
