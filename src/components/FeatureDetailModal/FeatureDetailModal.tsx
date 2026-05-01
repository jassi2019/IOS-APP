import Constants from 'expo-constants';
import { X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type FeatureDetail = {
  icon: string;
  num: string;
  name: string;
  desc: string;
};

type Props = {
  visible: boolean;
  feature: FeatureDetail | null;
  onClose: () => void;
  onStart?: () => void;
};

const PROTECT_KEY = 'feature-detail-modal';
const isExpoGo = Constants.appOwnership === 'expo';

export const FeatureDetailModal = ({ visible, feature, onClose, onStart }: Props) => {
  useEffect(() => {
    if (!visible || isExpoGo) return;
    let cleanup = () => {};
    (async () => {
      try {
        const ScreenCapture = await import('expo-screen-capture');
        await ScreenCapture.preventScreenCaptureAsync(PROTECT_KEY);
        if (Platform.OS === 'ios' && typeof ScreenCapture.enableAppSwitcherProtectionAsync === 'function') {
          await ScreenCapture.enableAppSwitcherProtectionAsync(0.8);
        }
        cleanup = () => {
          ScreenCapture.allowScreenCaptureAsync(PROTECT_KEY).catch(() => undefined);
          if (Platform.OS === 'ios' && typeof ScreenCapture.disableAppSwitcherProtectionAsync === 'function') {
            ScreenCapture.disableAppSwitcherProtectionAsync().catch(() => undefined);
          }
        };
      } catch {
        // Expo Go or unsupported environment — skip silently
      }
    })();
    return () => cleanup();
  }, [visible]);

  if (!feature) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={20} color="#6B7280" />
          </TouchableOpacity>

          <Text style={styles.icon} selectable={false}>
            {feature.icon}
          </Text>

          <Text style={styles.title} selectable={false}>
            {feature.num} {feature.name}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.desc} selectable={false}>
            {feature.desc}
          </Text>

          {onStart && (
            <TouchableOpacity style={styles.startBtn} onPress={onStart} activeOpacity={0.85}>
              <Text style={styles.startBtnText} selectable={false}>
                Start Learning
              </Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
  },
  icon: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    width: 48,
    height: 3,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    marginBottom: 14,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    textAlign: 'center',
  },
  startBtn: {
    marginTop: 18,
    backgroundColor: '#92400E',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  startBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default FeatureDetailModal;
