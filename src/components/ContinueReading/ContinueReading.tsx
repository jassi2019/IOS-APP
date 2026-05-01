import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

interface ContinueReadingProps {
  title: string;
  description: string;
  subject: string;
  isPremium?: boolean;
  isStartReading?: boolean;
  onPress: () => void;
}

export const ContinueReading = ({
  title,
  description,
  subject,
  isPremium = false,
  isStartReading = false,
  onPress,
}: ContinueReadingProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <Text style={styles.headerText}>
        {isStartReading ? 'Start Reading' : 'Continue Reading'}
      </Text>

      <View style={styles.divider} />

      <View style={styles.content}>
        <Text style={styles.summaryLabel}>Summary</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        <View style={styles.badgeContainer}>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectText}>{subject.toUpperCase()}</Text>
          </View>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 16,
  },
  content: {
    gap: 8,
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  subjectBadge: {
    backgroundColor: '#E8F3F1',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subjectText: {
    color: '#4E9982',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    color: '#F1BB3E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ContinueReading;
