import { Bell, X } from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type Notification = {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  unread?: boolean;
};

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: '🔥',
    title: 'Keep your streak alive!',
    message: 'You have studied today. Great work — keep going tomorrow!',
    time: 'Just now',
    unread: true,
  },
  {
    id: '2',
    icon: '📚',
    title: 'New chapter unlocked',
    message: 'Biology — Cell Structure and Functions is now available.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '3',
    icon: '🎯',
    title: 'Daily Practice Test ready',
    message: 'Your Daily Practice Test for today is ready. Take 15 minutes!',
    time: '5 hours ago',
  },
  {
    id: '4',
    icon: '💡',
    title: 'Tip of the day',
    message: 'Solve at least 5 PYQs every day to boost retention.',
    time: 'Yesterday',
  },
  {
    id: '5',
    icon: '🏆',
    title: 'Weekly Test results',
    message: 'You scored 82% in the last weekly test. Top 15%!',
    time: '3 days ago',
  },
];

export const NotificationsModal = ({ visible, onClose }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheet}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Bell size={20} color="#111" />
                  <Text style={styles.title}>Notifications</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.list}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
              >
                {SAMPLE_NOTIFICATIONS.map((n) => (
                  <TouchableOpacity
                    key={n.id}
                    style={[styles.item, n.unread && styles.itemUnread]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconWrap}>
                      <Text style={{ fontSize: 22 }}>{n.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.itemTopRow}>
                        <Text style={styles.itemTitle}>{n.title}</Text>
                        {n.unread && <View style={styles.dot} />}
                      </View>
                      <Text style={styles.itemMsg}>{n.message}</Text>
                      <Text style={styles.itemTime}>{n.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <View style={styles.empty}>
                  <Text style={styles.emptyText}>You're all caught up 🎉</Text>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '800', color: '#111' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingHorizontal: 16, paddingTop: 10 },
  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  itemUnread: { backgroundColor: '#FFF8E1' },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#111', flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#92400E' },
  itemMsg: { fontSize: 12, color: '#555', lineHeight: 16, marginBottom: 4 },
  itemTime: { fontSize: 10, color: '#999', fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 16 },
  emptyText: { fontSize: 12, color: '#999' },
});

export default NotificationsModal;
