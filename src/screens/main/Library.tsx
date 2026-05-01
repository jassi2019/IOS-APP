import { useAuth } from '@/contexts/AuthContext';
import { useGetFavorites } from '@/hooks/api/favorites';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, FileText, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LibraryProps = {
  navigation: any;
};

type ActiveTab = 'bookmarks' | 'notes';

export const Library = ({ navigation }: LibraryProps) => {
  const { isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('bookmarks');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>([]);

  const { data: favoritesData, isLoading } = useGetFavorites({ enabled: !isGuest });
  const favorites = isGuest ? [] : favoritesData?.data || [];

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNotes((prev) => [
      { id: Date.now().toString(), text: noteText.trim(), date: new Date().toLocaleDateString('en-IN') },
      ...prev,
    ]);
    setNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <LinearGradient
      colors={['#F5A623', '#F9C45A', '#FCDA3E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Library</Text>
          <Text style={styles.headerSub}>Your saved topics & personal notes</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'bookmarks' && styles.tabActive]}
            onPress={() => setActiveTab('bookmarks')}
            activeOpacity={0.85}
          >
            <Bookmark size={15} color={activeTab === 'bookmarks' ? '#fff' : '#92400E'} />
            <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.tabTextActive]}>
              Bookmarks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
            onPress={() => setActiveTab('notes')}
            activeOpacity={0.85}
          >
            <FileText size={15} color={activeTab === 'notes' ? '#fff' : '#92400E'} />
            <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>
              My Notes
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1, backgroundColor: '#FFF8E8' }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <>
              {isGuest ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyIcon}>🔖</Text>
                  <Text style={styles.emptyTitle}>Sign in to use Bookmarks</Text>
                  <Text style={styles.emptySub}>Save topics you want to revisit later</Text>
                  <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
                  >
                    <Text style={styles.ctaBtnText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              ) : isLoading ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptySub}>Loading bookmarks...</Text>
                </View>
              ) : favorites.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyIcon}>🔖</Text>
                  <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
                  <Text style={styles.emptySub}>
                    Open any topic and tap the bookmark icon to save it here
                  </Text>
                  <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'SubjectsTab' })}
                  >
                    <Text style={styles.ctaBtnText}>Browse Topics</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  <Text style={styles.sectionLabel}>{favorites.length} saved topics</Text>
                  {favorites.map((fav: any) => (
                    <TouchableOpacity
                      key={fav.id}
                      style={styles.favCard}
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate('TopicContent', { topic: fav.Topic })}
                    >
                      <View style={styles.favIcon}>
                        <Text style={{ fontSize: 22 }}>📌</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.favTitle} numberOfLines={2}>
                          {fav.Topic?.name || 'Saved Topic'}
                        </Text>
                        <Text style={styles.favSub}>{fav.Topic?.Chapter?.name || ''}</Text>
                      </View>
                      <Text style={styles.favArrow}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <>
              {/* Add note input */}
              <View style={styles.noteInputBox}>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Write a note..."
                  placeholderTextColor="#aaa"
                  value={noteText}
                  onChangeText={setNoteText}
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity
                  style={[styles.noteAddBtn, !noteText.trim() && { opacity: 0.4 }]}
                  onPress={handleAddNote}
                  disabled={!noteText.trim()}
                >
                  <Text style={styles.noteAddBtnText}>+ Add Note</Text>
                </TouchableOpacity>
              </View>

              {notes.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyIcon}>📝</Text>
                  <Text style={styles.emptyTitle}>No Notes Yet</Text>
                  <Text style={styles.emptySub}>Write notes while studying to remember key points</Text>
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  <Text style={styles.sectionLabel}>{notes.length} notes</Text>
                  {notes.map((note) => (
                    <View key={note.id} style={styles.noteCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.noteText}>{note.text}</Text>
                        <Text style={styles.noteDate}>{note.date}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteNote(note.id)}
                        style={styles.noteDelete}
                      >
                        <Text style={{ color: '#EF4444', fontSize: 18 }}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#111' },
  headerSub: { fontSize: 12, color: '#444', marginTop: 2 },

  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 0,
    backgroundColor: '#fff3d0',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 9, borderRadius: 11,
  },
  tabActive: { backgroundColor: '#92400E' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  tabTextActive: { color: '#fff' },

  scroll: { padding: 16, paddingBottom: 120 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#888', marginBottom: 4 },

  // Bookmarks
  favCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },
  favIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#FFF8E1', alignItems: 'center', justifyContent: 'center',
  },
  favTitle: { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 3 },
  favSub: { fontSize: 11, color: '#777' },
  favArrow: { fontSize: 24, color: '#92400E', fontWeight: '700' },

  // Notes
  noteInputBox: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },
  noteInput: {
    fontSize: 13, color: '#111', marginBottom: 10,
    minHeight: 70, textAlignVertical: 'top',
  },
  noteAddBtn: {
    backgroundColor: '#92400E', borderRadius: 10,
    paddingVertical: 10, alignItems: 'center',
  },
  noteAddBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  noteCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
    borderLeftWidth: 3, borderLeftColor: '#F6C228',
  },
  noteText: { fontSize: 13, color: '#111', lineHeight: 20, marginBottom: 4 },
  noteDate: { fontSize: 10, color: '#aaa' },
  noteDelete: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
  },

  // Empty
  emptyBox: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 6, textAlign: 'center' },
  emptySub: { fontSize: 12, color: '#777', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  ctaBtn: {
    backgroundColor: '#92400E', borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  ctaBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});

export default Library;
