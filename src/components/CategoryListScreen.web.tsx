import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { EVENTS, CAT_MAP, CategoryId, WhenFilter } from '../data';
import { EventCard } from './EventCard';
import { Colors, Radii, Shadows } from '../theme/tokens';
import { LocationState } from '../hooks/useAppState';
import { useFoursquarePlaces } from '../hooks/useFoursquarePlaces';
import { LiveEvent } from '../services/foursquare';

// Rocky Point, NY default coordinates
const DEFAULT_LAT = 40.9387;
const DEFAULT_LNG = -72.9268;

const WHEN_FILTERS: { id: WhenFilter | 'all'; label: string }[] = [
  { id: 'all',      label: 'Any time' },
  { id: 'today',    label: 'Today' },
  { id: 'weekend',  label: 'This weekend' },
  { id: 'nextweek', label: 'Next week' },
];

interface Props {
  catId: CategoryId;
  radius: number;
  location: LocationState;
  saved: number[];
  toggleSave: (id: number) => void;
}

export function CategoryListScreen({ catId, radius, location, saved, toggleSave }: Props) {
  const [when, setWhen] = useState<WhenFilter | 'all'>('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const cat = CAT_MAP[catId];

  const userLat = location.lat ?? DEFAULT_LAT;
  const userLng = location.lng ?? DEFAULT_LNG;

  const { places: fsqPlaces, loading: fsqLoading } = useFoursquarePlaces(userLat, userLng, radius, catId);

  let list = EVENTS.filter(e => e.cat === catId && e.dist <= radius);
  if (when !== 'all') list = list.filter(e => e.when === when);
  if (freeOnly) list = list.filter(e => e.price === 0);
  list = list.slice().sort((a, b) => a.dist - b.dist);

  // Filter FSQ places by radius and free filter
  const liveForCat: LiveEvent[] = fsqPlaces.filter(p => p.dist <= radius && (!freeOnly || p.price === 0));

  return (
    <View style={styles.screen}>
      {/* Sticky subhead */}
      <View style={styles.subhead}>
        <View style={styles.subRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>{cat.name}</Text>
        </View>
        <Text style={styles.sub}>Within {radius} mi of {location.short}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ gap: 8, paddingBottom: 2 }}>
          {WHEN_FILTERS.map(w => (
            <Pressable key={w.id} style={[styles.chip, when === w.id && styles.chipOn]}
              onPress={() => setWhen(w.id)}>
              <Text style={[styles.chipText, when === w.id && styles.chipTextOn]}>{w.label}</Text>
            </Pressable>
          ))}
          <Pressable style={[styles.chip, styles.freeChip, freeOnly && styles.freeChipOn]}
            onPress={() => setFreeOnly(v => !v)}>
            <Text style={[styles.chipText, freeOnly && styles.chipTextOn]}>Free only</Text>
          </Pressable>
        </ScrollView>
      </View>

      {list.length === 0 && liveForCat.length === 0 && !fsqLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyGlyph}>{cat.glyph}</Text>
          <Text style={styles.emptyTitle}>Nothing matches yet</Text>
          <Text style={styles.emptyBody}>Try widening your radius or clearing a filter to see more {cat.name.toLowerCase()}.</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {list.map(ev => (
            <EventCard key={ev.id} ev={ev} saved={saved.includes(ev.id)}
              onOpen={(id) => router.push({ pathname: '/event', params: { eventId: id } })}
              onToggleSave={toggleSave} />
          ))}

          {/* LIVE EVENTS section from Foursquare */}
          {(fsqLoading || liveForCat.length > 0) && (
            <>
              <View style={styles.liveSectionHead}>
                <Text style={styles.liveSectionTitle}>LIVE EVENTS NEARBY</Text>
                {fsqLoading && <ActivityIndicator size="small" color={Colors.brand} style={{ marginLeft: 8 }} />}
              </View>
              {liveForCat.map((place) => (
                <View key={`fsq-${place.id}-${place.title}`} style={styles.liveCard}>
                  <View style={styles.liveCardHeader}>
                    <Text style={styles.liveCardTitle} numberOfLines={2}>{place.title}</Text>
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                  </View>
                  {place.venue ? <Text style={styles.liveCardVenue} numberOfLines={1}>{place.venue}</Text> : null}
                  <View style={styles.liveCardMeta}>
                    <Text style={styles.liveCardMetaText}>{place.day}</Text>
                    {place.dist > 0 && (
                      <Text style={styles.liveCardMetaText}> · {place.dist.toFixed(1)} mi</Text>
                    )}
                    {place.about ? <Text style={styles.liveCardMetaText}> · {place.about}</Text> : null}
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  subhead: {
    backgroundColor: Colors.bg,
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.hair2,
  },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair,
    alignItems: 'center', justifyContent: 'center', ...Shadows.cardSm,
  },
  backText: { fontSize: 22, color: Colors.ink, lineHeight: 26 },
  heading: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, color: Colors.ink, letterSpacing: -0.3 },
  sub: { fontSize: 12.5, color: Colors.muted, fontWeight: '600', marginLeft: 46, marginTop: 2 },
  chips: { marginTop: 10 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1.5, borderColor: Colors.hair,
    backgroundColor: Colors.surface,
    ...Shadows.cardSm,
  },
  chipOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  chipText: { fontSize: 13, fontWeight: '700', color: Colors.ink2 },
  chipTextOn: { color: '#fff' },
  freeChip: {},
  freeChipOn: { backgroundColor: Colors.craft, borderColor: Colors.craft },
  list: { flex: 1 },
  listContent: { gap: 14, padding: 20, paddingBottom: 32 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyGlyph: { fontSize: 52 },
  emptyTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, color: Colors.ink, marginTop: 14, marginBottom: 6 },
  emptyBody: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 21 },
  liveSectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  liveSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.muted,
  },
  liveCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.cardSm,
    borderWidth: 1.5,
    borderColor: Colors.hair,
    padding: 14,
    ...Shadows.cardSm,
  },
  liveCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  liveCardTitle: {
    flex: 1,
    fontFamily: 'BricolageGrotesque_700Bold',
    fontSize: 15,
    color: Colors.ink,
    lineHeight: 19,
  },
  liveBadge: {
    backgroundColor: Colors.brand,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveCardVenue: {
    fontSize: 12.5,
    color: Colors.ink2,
    fontWeight: '600',
    marginTop: 4,
  },
  liveCardMeta: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  liveCardMetaText: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: '600',
  },
});
