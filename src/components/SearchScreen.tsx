import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { EVENTS, CAT_MAP } from '../data';
import { EventCard } from './EventCard';
import { Colors, Radii, Shadows, Spacing } from '../theme/tokens';

interface Props {
  radius: number;
  saved: number[];
  toggleSave: (id: number) => void;
}

export function SearchScreen({ radius, saved, toggleSave }: Props) {
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();

  let list = EVENTS.filter(e => e.dist <= radius);
  if (ql) list = list.filter(e =>
    e.title.toLowerCase().includes(ql) ||
    e.venue.toLowerCase().includes(ql) ||
    CAT_MAP[e.cat].name.toLowerCase().includes(ql)
  );
  list = list.slice().sort((a, b) => a.dist - b.dist);

  return (
    <View style={styles.screen}>
      <View style={styles.greeting}>
        <Text style={styles.h1}>Search</Text>
      </View>
      <View style={styles.searchField}>
        <Text style={styles.ic}>⎕</Text>
        <TextInput
          style={styles.input}
          placeholder="Festivals, bands, food trucks…"
          placeholderTextColor={Colors.muted}
          value={q}
          onChangeText={setQ}
          returnKeyType="search"
        />
        {q.length > 0 && (
          <Pressable onPress={() => setQ('')} hitSlop={8}>
            <Text style={styles.clearIc}>✕</Text>
          </Pressable>
        )}
      </View>

      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyGlyph}>🔍</Text>
          <Text style={styles.emptyTitle}>No matches</Text>
          <Text style={styles.emptyBody}>Try a different word, or widen your search radius.</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {list.map(ev => (
            <EventCard key={ev.id} ev={ev} saved={saved.includes(ev.id)}
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
  searchField: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair,
    borderRadius: Radii.button, paddingHorizontal: 16, paddingVertical: 13,
    marginHorizontal: Spacing.screenH, marginTop: 6, marginBottom: 0,
    ...Shadows.cardSm,
  },
  ic: { fontSize: 18, color: Colors.muted },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.ink },
  clearIc: { fontSize: 14, color: Colors.muted },
  list: { flex: 1 },
  listContent: { gap: 14, padding: 20, paddingTop: 14, paddingBottom: 32 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyGlyph: { fontSize: 52 },
  emptyTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, color: Colors.ink, marginTop: 14, marginBottom: 6 },
  emptyBody: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 21 },
});
