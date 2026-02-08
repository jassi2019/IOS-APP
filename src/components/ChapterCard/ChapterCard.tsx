// import React from 'react';
// import { Text, TouchableOpacity } from 'react-native';

// type ChapterListingCardProps = {
//   title: string;
//   description: string;
//   onPress: () => void;
// };

// export const ChapterListingCard = ({ title, description, onPress }: ChapterListingCardProps) => {
//   return (
//     <TouchableOpacity className="mx-4 my-2 bg-white rounded-2xl p-4 shadow-sm" onPress={onPress}>
//       <Text className="text-xl font-semibold text-gray-800">{title}</Text>
//       <Text className="text-gray-500 mt-1 mb-2">{description}</Text>
//     </TouchableOpacity>
//   );
// };

import { TChapter } from '@/types/Chapter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ChapterListingCardProps = {
  chapter: Pick<TChapter, 'id' | 'name' | 'description' | 'number'>;
  onPress: () => void;
};

export const ChapterListingCard = ({ chapter, onPress }: ChapterListingCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {chapter.name}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" style={styles.icon} />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {chapter.description}
        </Text>

        <Text style={styles.chapterNumber}>
          Chapter {chapter.number || 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    paddingRight: 12,
    lineHeight: 24,
  },
  icon: {
    marginTop: 2,
  },
  description: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  chapterNumber: {
    color: '#F1BB3E',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    fontWeight: '500',
  },
});
