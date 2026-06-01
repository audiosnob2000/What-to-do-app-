import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { EVENTS } from '../data';
import { EventCard } from './EventCard';
import { Colors, Radii, Shadows, Spacing } from '../theme/tokens';

interface Props {
  saved: number[];
  toggleSave: (id: number) => void;
}

export function SavedScreen({ saved, toggleSave }: Props) {
  const list = EVENTS.filter(e => saved.includes(e.id));

  return (
    <View style={styles.screen}>
      <View style={styles.greeting}>
        <Text style={styles.h1}>Saved</Text>
      </View>
      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyGlyph}>♡</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyBody}>Tap the heart on any event to keep it here for later.</Text>
          <Pressable style={styles.browseBtn} onPress={() => router.push('/')}>
            <Text style={styles.browseBtnText}>Browse events</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {list.map(ev => (
            <EventCard key={ev.id} ev={ev} saved={true}
              onOpen={(id) => router.push({ pathname: '/event', params: { eventId: id } })}
              onToggleSave={toggleSave} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  greeting: { paddingHorizontal: Spacing.screenH, paddingTop: 8, paddingBottom: 4 },
  h1: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 30, color: Colors.ink, letterSpacing: -0.5 },
  list: { flex: 1 },
  listContent: { gap: 14, padding: 20, paddingTop: 8, paddingBottom: 32 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyGlyph: { fontSize: 52, color: Colors.muted },
  emptyTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, color: Colors.ink, marginTop: 14, marginBottom: 6 },
  emptyBody: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
  browseBtn: {
    backgroundColor: Colors.brand, borderRadius: Radii.button,
    paddingHorizontal: 22, paddingVertical: 12,
    ...Shadows.cardSm,
  },
  browseBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
