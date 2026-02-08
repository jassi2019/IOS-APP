import BotanyIcon from '@/assets/icons/Botany';
import ChemistryIcon from '@/assets/icons/Chemistry';
import PhysicsIcon from '@/assets/icons/Physics';
import ZoologyIcon from '@/assets/icons/Zoology';
import { TSubject } from '@/types/Subject';
import { Book } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SubjectCardProps = {
  subject: TSubject;
  onPress: () => void;
};

const getSubjectIcon = (subject: string) => {
  switch (subject.trim().toLowerCase()) {
    case 'physics':
      return PhysicsIcon;
    case 'chemistry':
      return ChemistryIcon;
    case 'botany':
      return BotanyIcon;
    case 'zoology':
      return ZoologyIcon;
    default:
      return Book;
  }
};

export const SubjectCard = ({ subject, onPress }: SubjectCardProps) => {
  const IconComponent = getSubjectIcon(subject.name);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icon on the left */}
        <View style={styles.iconContainer}>
          <IconComponent width={40} height={40} />
        </View>
        
        {/* Text on the right */}
        <View style={styles.textContainer}>
          <Text style={styles.subjectName}>
            {subject.name.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 80,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#F1BB3E20',
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E1E1E',
    letterSpacing: 0.5,
  },
});

export default SubjectCard;
