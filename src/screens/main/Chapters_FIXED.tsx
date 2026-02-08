import { ChapterListingCard } from '@/components/ChapterCard/ChapterCard';
import { useGetChaptersBySubjectId } from '@/hooks/api/chapters';
import { useGetAllClasses } from '@/hooks/api/classes';
import { TChapter } from '@/types/Chapter';
import { TClass } from '@/types/Class';
import { ChevronDown, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChaptersScreenProps = {
  navigation: any;
  route: {
    params?: {
      subjectId?: string;
      subjectTitle?: string;
    };
  };
};

const Chapters = ({ navigation, route }: ChaptersScreenProps) => {
  /* ------------------------------------------------------------------ */
  /* ROUTE PARAMS (GUARDED) */
  /* ------------------------------------------------------------------ */
  const subjectId = route?.params?.subjectId;
  const subjectTitle = route?.params?.subjectTitle;

  if (!subjectId || !subjectTitle) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Invalid subject data</Text>
      </SafeAreaView>
    );
  }

  /* ------------------------------------------------------------------ */
  /* STATE */
  /* ------------------------------------------------------------------ */
  const [selectedClass, setSelectedClass] = useState<TClass['id'] | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  /* ------------------------------------------------------------------ */
  /* FETCH CLASSES */
  /* ------------------------------------------------------------------ */
  const { data: classes, isLoading: classesLoading, error: classesError } = useGetAllClasses();

  /* SET DEFAULT CLASS (ONCE) */
  useEffect(() => {
    if (classes?.data?.length && !selectedClass) {
      setSelectedClass(classes.data[0].id);
    }
  }, [classes, selectedClass]);

  /* ------------------------------------------------------------------ */
  /* FETCH CHAPTERS (ONLY WHEN READY) */
  /* ------------------------------------------------------------------ */
  const shouldFetchChapters = Boolean(subjectId && selectedClass);

  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useGetChaptersBySubjectId(
    shouldFetchChapters ? { subjectId, classId: selectedClass as string } : null
  );

  /* ------------------------------------------------------------------ */
  /* HANDLERS */
  /* ------------------------------------------------------------------ */
  const handleBack = () => navigation.goBack();

  const handleChapterPress = (chapter: TChapter) => {
    navigation.navigate('Topics', {
      subjectId,
      subjectTitle,
      chapterId: chapter.id,
      chapterTitle: chapter.name,
      chapterNumber: chapter.number,
    });
  };

  const handleClassSelect = (classId: TClass['id']) => {
    setSelectedClass(classId);
    setIsDropdownVisible(false);
  };

  /* ------------------------------------------------------------------ */
  /* LOADING & ERROR STATES */
  /* ------------------------------------------------------------------ */
  if (classesLoading || chaptersLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#F1BB3E" />
      </SafeAreaView>
    );
  }

  if (classesError || chaptersError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>
          {classesError?.message || chaptersError?.message || 'Something went wrong'}
        </Text>
      </SafeAreaView>
    );
  }

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */
  return (
    <SafeAreaView style={styles.container}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
          <Text style={styles.headerTitle}>{subjectTitle}</Text>
        </TouchableOpacity>

        {/* CLASS DROPDOWN */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownVisible((prev) => !prev)}
          >
            <Text style={styles.dropdownText}>
              {classes?.data?.find((c: TClass) => c.id === selectedClass)?.name || 'Select Class'}
            </Text>
            <ChevronDown size={16} color="#000" />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={styles.dropdownMenu}>
              {classes?.data?.map((item: TClass) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => handleClassSelect(item.id)}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* ---------------- CONTENT ---------------- */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!chapters?.data?.length ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No chapters found</Text>
          </View>
        ) : (
          chapters.data.map((chapter: TChapter) => (
            <ChapterListingCard
              key={chapter.id}
              chapter={chapter}
              onPress={() => handleChapterPress(chapter)}
            />
          ))
        )}
      </ScrollView>

      {/* ---------------- PREMIUM MODAL ---------------- */}
      <NoSubscriptionAlertModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setShowPremiumModal(false);
          navigation.navigate('Plans');
        }}
      />
    </SafeAreaView>
  );
};

/* ------------------------------------------------------------------ */
/* MODAL */
/* ------------------------------------------------------------------ */
const NoSubscriptionAlertModal = ({
  visible,
  onClose,
  onUpgrade,
}: {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}) => (
  <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Premium required</Text>
            <Text style={styles.modalSubtitle}>Access premium content with a Pro subscription</Text>
            <TouchableOpacity style={styles.modalButton} onPress={onUpgrade}>
              <Text style={styles.modalButtonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

/* ------------------------------------------------------------------ */
/* STYLES */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6F0',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropdownText: {
    marginRight: 8,
    fontSize: 14,
    color: '#000',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
    minWidth: 120,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120, // bottom nav safe
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#F4B95F',
    borderRadius: 8,
    paddingVertical: 12,
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default Chapters;
