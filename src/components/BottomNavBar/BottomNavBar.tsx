import { useNavigation } from '@react-navigation/native';
import { Home, Notebook, User } from 'lucide-react-native';
import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export type TabName = 'Home' | 'Subjects' | 'Profile';

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

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useBottomNav();
  const navigation = useNavigation();

  const navItems: NavItem[] = [
    {
      icon: Home,
      tab: 'Home',
    },
    {
      icon: Notebook,
      tab: 'Subjects',
    },
    {
      icon: User,
      tab: 'Profile',
    },
  ];

  const handleTabPress = (tab: TabName) => {
    // Don't navigate if already on this tab
    if (tab === activeTab) {
      console.log(`Already on ${tab} tab, skipping navigation`);
      return;
    }

    setActiveTab(tab);

    // Map tab names to actual navigator screen names
    const screenMap: Record<TabName, string> = {
      Home: 'HomeTab',
      Subjects: 'SubjectsTab',
      Profile: 'ProfileTab',
    };

    // Navigate to the tab within the MainTabs navigator
    try {
      console.log(`Navigating to ${tab} (${screenMap[tab]})`);
      // @ts-ignore - Navigate to nested tab
      navigation.navigate('MainTabs', { screen: screenMap[tab] });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: try direct navigation
      try {
        navigation.navigate(screenMap[tab] as never);
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
      }
    }
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeTab === item.tab;
        return (
          <TouchableOpacity
            key={item.tab}
            onPress={() => handleTabPress(item.tab)}
            activeOpacity={0.7}
            style={styles.tabButton}
          >
            {/* Icon only - no indicator */}
            <item.icon
              size={28}
              color={isActive ? '#000000' : '#9CA3AF'}
              strokeWidth={isActive ? 2 : 1.5}
              fill="none"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

type NavItem = {
  icon: typeof Home | typeof Notebook | typeof User;
  tab: TabName;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
});

export default BottomNav;
