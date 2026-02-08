import { Header } from '@/components/Header/Header';
import SubjectCard from '@/components/SubjectCard/SubjectCard';
import { getGuestSubjectsWithFreeTopics } from '@/constants/guestData';
import { useAuth } from '@/contexts/AuthContext';
import { useGetAllSubjects } from '@/hooks/api/subjects';
import { TSubject } from '@/types/Subject';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SubjectsScreenProps = {
  navigation: any;
};

export const Subjects = ({ navigation }: SubjectsScreenProps) => {
  const { isGuest } = useAuth();
  const { data, isLoading, error } = useGetAllSubjects({ enabled: !isGuest });
  const guestSubjects = getGuestSubjectsWithFreeTopics();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubjectPress = (subject: TSubject) => {
    navigation.navigate('Chapters', {
      subjectId: subject.id,
      subjectTitle: subject.name,
    });
  };

  if (!isGuest && isLoading)
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F1BB3E" />
      </SafeAreaView>
    );

  if (!isGuest && error)
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Error Fetching Data</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.innerContainer}>
        <Header title="Subjects" onBack={handleBack} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {(isGuest ? guestSubjects : data?.data || []).map((subject: TSubject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onPress={() => handleSubjectPress(subject)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  innerContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6F0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Subjects;
