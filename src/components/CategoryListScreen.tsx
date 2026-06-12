import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { router } from 'expo-router';
import { EVENTS, CAT_MAP, CategoryId, WhenFilter } from '../data';
import { EventCard } from './EventCard';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { Colors, Radii, Shadows } from '../theme/tokens';
import { LocationState } from '../hooks/useAppState';
import { useEventbriteEvents } from '../hooks/useEventbriteEvents';
import { useLiveEvents } from '../hooks/useLiveEvents';

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
  userLat?: number;
  userLng?: number;
}

export function CategoryListScreen({ catId, radius, location, saved, toggleSave, userLat = 40.9232, userLng = -72.9382 }: Props) {
  const [when, setWhen] = useState<WhenFilter | 'all'>('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const cat = CAT_MAP[catId];

  let list = EVENTS.filter(e => e.cat === catId && e.dist <= radius);
  if (when !== 'all') list = list.filter(e => e.when === when);
  if (freeOnly) list = list.filter(e => e.price === 0);
  list = list.slice().sort((a, b) => a.dist - b.dist);

  const { events: ebEvents, loading: ebLoading } = useEventbriteEvents(userLat, userLng, radius);
  const { events: tmEvents, loading: tmLoading } = useLiveEvents(userLat, userLng, radius, catId);

  const liveForCat = [
    ...tmEvents.filter(e => e.cat === catId).map(e => ({ ...e, source: 'tm' as const })),
    ...ebEvents.filter(e => e.cat === catId).map(e => ({ ...e, source: 'eb' as const })),
  ].filter(e => !freeOnly || e.price === 0);

  const liveLoading = ebLoading || tmLoading;
  const totalCount = list.length + liveForCat.length;

  return (
    <View style={styles.screen}>
      <View style={styles.subhead}>
        <View style={styles.subRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>{cat.name}</Text>
          {totalCount > 0 && <Text style={styles.countBadge}>{totalCount}</Text>}
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

      {totalCount === 0 && !liveLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyGlyph}>{cat.glyph}</Text>
          <Text style={styles.emptyTitle}>Nothing matches yet</Text>
          <Text style={styles.emptyBody}>Try widening your radius or clearing a filter to see more {cat.name.toLowerCase()}.</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

          {/* Live events from Ticketmaster + Eventbrite */}
          {liveLoading ? (
            <View style={styles.liveLoadRow}>
              <ActivityIndicator size="small" color={Colors.brand} />
              <Text style={styles.liveLoadText}>Loading live events…</Text>
            </View>
          ) : liveForCat.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>LIVE EVENTS</Text>
              {liveForCat.map(ev => (
                <Pressable key={`${ev.source}-${ev.id}`} style={styles.liveCard}
                  onPress={() => ev.url && Linking.openURL(ev.url)}>
                  <View style={styles.liveThumb}>
                    <PhotoPlaceholder catId={ev.cat} glyphSize={28} style={StyleSheet.absoluteFill} />
                  </View>
                  <View style={styles.liveInfo}>
                    <View style={styles.liveTagRow}>
                      <Text style={[styles.liveSource, { color: cat.color }]}>
                        {ev.source === 'tm' ? 'TICKETMASTER' : 'EVENTBRITE'}
                      </Text>
                    </View>
                    <Text style={styles.liveTitle} numberOfLines={2}>{ev.title}</Text>
                    <Text style={styles.liveVenue} numberOfLines={1}>{ev.venue}</Text>
                    <View style={styles.liveFooter}>
                      <Text style={styles.liveDay}>📅 {ev.day}</Text>
                      <Text style={[styles.livePrice, ev.price === 0 && styles.livePriceFree]}>
                        {ev.price === null ? '' : ev.price === 0 ? 'Free' : `From $${Math.round(ev.price)}`}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </>
          ) : null}

          {/* Local mock events */}
          {list.length > 0 && (
            <>
              {liveForCat.length > 0 && <Text style={styles.sectionLabel}>LOCAL PICKS</Text>}
              {list.map(ev => (
                <EventCard key={ev.id} ev={ev} saved={saved.includes(ev.id)}
                  onOpen={(id) => router.push({ pathname: '/event', params: { eventId: id } })}
                  onToggleSave={toggleSave} />
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
  countBadge: { backgroundColor: Colors.brand, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12, fontWeight: '700', color: '#fff', overflow: 'hidden' },
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
  listContent: { gap: 14, padding: 16, paddingBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.muted, letterSpacing: 0.8, marginBottom: -4, marginTop: 4 },
  liveLoadRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  liveLoadText: { fontSize: 14, color: Colors.muted },
  liveCard: {
    flexDirection: 'row',
    gap: 13,
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: 11,
    borderWidth: 1,
    borderColor: Colors.hair2,
    alignItems: 'stretch',
    ...Shadows.cardSm,
  },
  liveThumb: { width: 92, height: 92, borderRadius: Radii.cardSm, overflow: 'hidden' },
  liveInfo: { flex: 1, minWidth: 0 },
  liveTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveSource: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  liveTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16.5, lineHeight: 20, marginTop: 3, color: Colors.ink },
  liveVenue: { fontSize: 13, color: Colors.muted, fontWeight: '600', marginTop: 3 },
  liveFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 7 },
  liveDay: { fontSize: 13, color: Colors.ink2, fontWeight: '600' },
  livePrice: { fontSize: 13, fontWeight: '700', color: Colors.brandInk },
  livePriceFree: { color: Colors.craft },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyGlyph: { fontSize: 52 },
  emptyTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, color: Colors.ink, marginTop: 14, marginBottom: 6 },
  emptyBody: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 21 },
});
