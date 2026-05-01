import { TClass } from '@/types/Class';
import React, { useEffect, useState } from 'react';
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
  classes: TClass[];
  subjectName: string;
  subjectEmoji: string;
  onContinue: (classId: string) => void;
};

export const ClassSelectModal = ({
  visible,
  onClose,
  classes,
  subjectName,
  subjectEmoji,
  onContinue,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (visible && classes.length > 0 && !selectedId) {
      setSelectedId(classes[0].id);
    }
    if (!visible) {
      setSelectedId(null);
    }
  }, [visible, classes, selectedId]);

  const handleContinue = () => {
    if (selectedId) onContinue(selectedId);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheet}>
              <View style={styles.grip} />

              <View style={styles.badgeWrap}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{subjectEmoji} {subjectName.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.title}>Select Your Class</Text>
              <Text style={styles.subtitle}>Pick the class to view its chapters</Text>

              <View style={styles.options}>
                {classes.map((cls, idx) => {
                  const isSelected = cls.id === selectedId;
                  const isAlt = idx % 2 === 1;
                  return (
                    <TouchableOpacity
                      key={cls.id}
                      style={[styles.card, isSelected && styles.cardSelected]}
                      activeOpacity={0.85}
                      onPress={() => setSelectedId(cls.id)}
                    >
                      <View style={[styles.icon, isAlt && styles.iconAlt]}>
                        <Text style={styles.iconText}>
                          {cls.name.replace(/[^0-9]/g, '') || cls.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{cls.name}</Text>
                        <Text style={styles.cardDesc}>Tap to load chapters</Text>
                      </View>
                      <View style={[styles.radio, isSelected && styles.radioSelected]}>
                        {isSelected && <Text style={styles.radioCheck}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[styles.cta, !selectedId && styles.ctaDisabled]}
                onPress={handleContinue}
                disabled={!selectedId}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaText}>CONTINUE →</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF8E8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 30,
  },
  grip: {
    width: 40, height: 4, borderRadius: 4,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginBottom: 16,
  },
  badgeWrap: { alignItems: 'center', marginBottom: 18 },
  badge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { color: '#b8860b', fontSize: 11, fontWeight: '800' },
  title: { fontSize: 19, fontWeight: '900', color: '#111', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 22 },
  options: { gap: 12, marginBottom: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#92400E',
    backgroundColor: '#FFFBEA',
  },
  icon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#92400E',
    alignItems: 'center', justifyContent: 'center',
  },
  iconAlt: { backgroundColor: '#1976D2' },
  iconText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#111', marginBottom: 2 },
  cardDesc: { fontSize: 11, color: '#777' },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#92400E',
    backgroundColor: '#92400E',
  },
  radioCheck: { color: '#fff', fontSize: 12, fontWeight: '900' },
  cta: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: '#666' },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
});

export default ClassSelectModal;
