import { ChevronDown, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onSubtitlePress?: () => void;
};

export const Header = ({ title, subtitle, onBack, onSubtitlePress }: HeaderProps) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>

      {subtitle && (
        <TouchableOpacity onPress={onSubtitlePress} style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <ChevronDown size={20} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  title: { fontSize: 20, fontWeight: '600', flex: 1 },
  subtitleContainer: { flexDirection: 'row', alignItems: 'center' },
  subtitle: { fontSize: 16, marginRight: 6 },
});

export default Header;
