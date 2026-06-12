import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  ActivityIndicator, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { CATEGORIES, EVENTS, CAT_MAP } from '../data';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { Colors, Radii, Shadows, Spacing } from '../theme/tokens';
import { LocationState } from '../hooks/useAppState';
import { useLiveEvents } from '../hooks/useLiveEvents';
import { useEventbriteEvents } from '../hooks/useEventbriteEvents';

interface Props {
  location: LocationState;
  radius: number;
  setRadius: (r: number) => void;
  onOpenLocation: () => void;
  onUseGps: () => void;
  gpsLoading: boolean;
  saved: number[];
  toggleSave: (id: number) => void;
  userLat?: number;
  userLng?: number;
}

export function HomeScreen({
  location, radius, setRadius, onOpenLocation, onUseGps, gpsLoading, saved, toggleSave,
  userLat = 40.9232, userLng = -72.9382,
}: Props) {
  const counts: Record<string, number> = {};
  CATEGORIES.forEach(c => {
    counts[c.id] = EVENTS.filter(e => e.cat === c.id && e.dist <= radius).length;
  });

  const featured = EVENTS
    .filter(e => e.when === 'weekend' && e.dist <= radius)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 6);

  const { events: tmEvents, loading: tmLoading } = useLiveEvents(userLat, userLng, radius);
  const { events: ebEvents, loading: ebLoading } = useEventbriteEvents(userLat, userLng, radius);

  const pct = ((radius - 1) / (50 - 1)) * 100;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  function renderEventCard(ev: any, key: string) {
    const cat = CAT_MAP[ev.cat];
    return (
      <Pressable key={key} style={styles.liveCard} onPress={() => ev.url && Linking.openURL(ev.url)}>
        <View style={[styles.liveCardTop, { backgroundColor: cat.g1 }]}>
          <Text style={styles.liveCardGlyph}>{cat.glyph}</Text>
          <View style={[styles.liveBadge, { backgroundColor: cat.color }]}>
            <Text style={styles.liveBadgeText}>{cat.name}</Text>
          </View>
          {ev.price !== null && ev.price !== undefined && (
            <View style={styles.livePriceBadge}>
              <Text style={styles.livePriceText}>{ev.price === 0 ? 'Free' : `From $${Math.round(ev.price)}`}</Text>
            </View>
          )}
        </View>
        <View style={styles.liveCardBody}>
          <Text style={styles.liveCardTitle} numberOfLines={2}>{ev.title}</Text>
          <Text style={styles.liveCardVenue} numberOfLines={1}>{ev.venue}</Text>
          <Text style={styles.liveCardDay}>{ev.day}</Text>
          {ev.dist != null && <Text style={styles.liveCardDist}>{ev.dist.toFixed(1)} mi away</Text>}
        </View>
      </Pressable>
    );
  }

  const allLiveEvents = [
    ...tmEvents.map(e => ({ ...e, source: 'tm' })),
    ...ebEvents.map(e => ({ ...e, source: 'eb' })),
  ].slice(0, 20);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.greeting}>
        <Text style={styles.hello}>{greeting} 👋</Text>
        <Text style={styles.h1}>{"What's going on\nnear you?"}</Text>
      </View>

      <View style={styles.locRow}>
        <Pressable style={styles.locPill} onPress={onOpenLocation}>
          <Text style={styles.locIc}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.locLabel}>{location.viaGps ? 'CURRENT LOCATION' : 'LOCATION'}</Text>
            <Text style={styles.locVal}>{location.label}</Text>
          </View>
          <Text style={styles.locChev}>▾</Text>
        </Pressable>
        <Pressable style={[styles.gpsBtn, gpsLoading && styles.gpsBtnLoading]} onPress={onUseGps}>
          {gpsLoading
            ? <ActivityIndicator size="small" color={Colors.brandInk} />
            : <Text style={styles.gpsBtnText}>◎</Text>}
        </Pressable>
      </View>

      <View style={styles.radiusCard}>
        <View style={styles.radiusTop}>
          <Text style={styles.radiusLabel}>Search radius</Text>
          <Text style={styles.radiusVal}>{radius} <Text style={styles.radiusUnit}>{radius === 1 ? 'mile' : 'miles'}</Text></Text>
        </View>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${pct}%` as any }]} />
          <View style={styles.sliderThumbWrap}>
            <View style={[styles.sliderThumb, { left: `${pct}%` as any, marginLeft: -13 }]} />
          </View>
        </View>
        <View style={styles.sliderBtns}>
          {[1, 5, 10, 15, 25, 35, 50].map(v => (
            <Pressable key={v} onPress={() => setRadius(v)}
              style={[styles.sliderBtn, radius === v && styles.sliderBtnOn]}>
              <Text style={[styles.sliderBtnText, radius === v && styles.sliderBtnTextOn]}>{v}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.scaleMarks}>
          <Text style={styles.scaleMark}>1 mi</Text>
          <Text style={styles.scaleMark}>25 mi</Text>
          <Text style={styles.scaleMark}>50 mi</Text>
        </View>
      </View>

      <View style={styles.secHead}>
        <Text style={styles.secHeadText}>Live events near you</Text>
        {allLiveEvents.length > 0 && <Text style={styles.secCount}>{allLiveEvents.length} found</Text>}
      </View>
      {(tmLoading || ebLoading) && allLiveEvents.length === 0 ? (
        <View style={styles.liveLoadWrap}>
          <ActivityIndicator size="small" color={Colors.brand} />
          <Text style={styles.liveLoadText}>Finding events…</Text>
        </View>
      ) : allLiveEvents.length === 0 ? (
        <View style={styles.liveLoadWrap}>
          <Text style={styles.liveLoadText}>No events found in this area</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.rail} contentContainerStyle={{ gap: 14, paddingHorizontal: Spacing.screenH }}>
          {allLiveEvents.map(ev => renderEventCard(ev, `${ev.source}-${ev.id}`))}
        </ScrollView>
      )}

      <View style={styles.secHead}>
        <Text style={styles.secHeadText}>What are you in the mood for?</Text>
      </View>
      <View style={styles.catGrid}>
        {CATEGORIES.map(c => {
          const n = counts[c.id] || 0;
          return (
            <Pressable
              key={c.id}
              style={({ pressed }) => [styles.catCard, { backgroundColor: c.g1 }, pressed && { transform: [{ scale: 0.97 }] }]}
              onPress={() => router.push({ pathname: '/category', params: { catId: c.id } })}
            >
              <Text style={styles.catGlyph}>{c.glyph}</Text>
              <Text style={styles.catName}>{c.name}</Text>
              <View style={[styles.catCount, n === 0 && styles.catCountNone]}>
                <Text style={styles.catCountText}>{n === 0 ? 'none in range' : `${n} nearby`}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {featured.length > 0 && (
        <>
          <View style={styles.secHead}>
            <Text style={styles.secHeadText}>Happening this weekend</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.rail} contentContainerStyle={{ gap: 14, paddingHorizontal: Spacing.screenH }}>
            {featured.map(ev => {
              const cat = CAT_MAP[ev.cat];
              return (
                <Pressable key={ev.id} style={styles.featCard}
                  onPress={() => router.push({ pathname: '/event', params: { eventId: ev.id } })}>
                  <View style={styles.featPhoto}>
                    <PhotoPlaceholder catId={ev.cat} glyphSize={40} style={StyleSheet.absoluteFill} />
                    <View style={[styles.featBadge, { backgroundColor: cat.color }]}>
                      <Text style={styles.featBadgeText}>{cat.name}</Text>
                    </View>
                    <Pressable style={styles.featHeart} onPress={() => toggleSave(ev.id)} hitSlop={8}>
                      <Text style={[styles.featHeartText, saved.includes(ev.id) && styles.heartOn]}>
                        {saved.includes(ev.id) ? '♥' : '♡'}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.featBody}>
                    <Text style={styles.featTitle} numberOfLines={2}>{ev.title}</Text>
                    <Text style={styles.featMeta}>{ev.day} · {ev.dist} mi · {ev.price === 0 ? 'Free' : '$' + ev.price}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: 28 },
  greeting: { paddingHorizontal: Spacing.screenH, paddingTop: 8, paddingBottom: 4 },
  hello: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
  h1: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 30, lineHeight: 31, color: Colors.ink, marginTop: 2, letterSpacing: -0.5 },
  locRow: { flexDirection: 'row', gap: 10, paddingHorizontal: Spacing.screenH, paddingTop: 14, paddingBottom: 4, alignItems: 'stretch' },
  locPill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair, borderRadius: Radii.pill, paddingHorizontal: 16, paddingVertical: 11, ...Shadows.cardSm },
  locIc: { fontSize: 17, color: Colors.brand },
  locLabel: { fontSize: 12, color: Colors.muted, fontWeight: '600', lineHeight: 14 },
  locVal: { fontSize: 15, fontWeight: '700', color: Colors.ink, lineHeight: 18 },
  locChev: { color: Colors.muted, marginLeft: 4 },
  gpsBtn: { backgroundColor: Colors.brand, borderRadius: Radii.pill, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', minWidth: 48, ...Shadows.cardSm },
  gpsBtnLoading: { backgroundColor: Colors.brandSoft },
  gpsBtnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  radiusCard: { marginHorizontal: Spacing.screenH, marginTop: 14, marginBottom: 2, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair, borderRadius: Radii.cardSm, padding: 16, ...Shadows.cardSm },
  radiusTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  radiusLabel: { fontSize: 14, fontWeight: '700', color: Colors.ink2 },
  radiusVal: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 17, color: Colors.brand },
  radiusUnit: { fontSize: 13, fontWeight: '600', color: Colors.muted, fontFamily: 'HankenGrotesk_600SemiBold' },
  sliderTrack: { height: 8, backgroundColor: Colors.hair, borderRadius: 999, position: 'relative', marginBottom: 10 },
  sliderFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: Colors.brand, borderRadius: 999 },
  sliderThumbWrap: { position: 'absolute', top: -9, left: 0, right: 0 },
  sliderThumb: { position: 'absolute', width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', borderWidth: 5, borderColor: Colors.brand, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 3 },
  sliderBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sliderBtn: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 },
  sliderBtnOn: { backgroundColor: Colors.brand },
  sliderBtnText: { fontSize: 12, fontWeight: '700', color: Colors.muted },
  sliderBtnTextOn: { color: '#fff' },
  scaleMarks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  scaleMark: { fontSize: 11, color: Colors.muted, fontWeight: '600' },
  secHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingHorizontal: Spacing.screenH, paddingTop: 22, paddingBottom: 12 },
  secHeadText: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 21, color: Colors.ink, letterSpacing: -0.3 },
  secCount: { fontSize: 13, fontWeight: '600', color: Colors.muted },
  liveLoadWrap: { paddingHorizontal: Spacing.screenH, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveLoadText: { fontSize: 14, color: Colors.muted },
  rail: { marginTop: 4 },
  liveCard: { width: 220, backgroundColor: Colors.surface, borderRadius: Radii.card, overflow: 'hidden', ...Shadows.card },
  liveCardTop: { height: 110, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  liveCardGlyph: { fontSize: 48, opacity: 0.7 },
  liveBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  liveBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  livePriceBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  livePriceText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  liveCardBody: { padding: 10 },
  liveCardTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 15, color: Colors.ink, lineHeight: 18, marginBottom: 4 },
  liveCardVenue: { fontSize: 12, color: Colors.muted, fontWeight: '600', marginBottom: 2 },
  liveCardDay: { fontSize: 12, color: Colors.ink2, fontWeight: '600', marginBottom: 2 },
  liveCardDist: { fontSize: 11, color: Colors.muted },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.gridGap, paddingHorizontal: Spacing.screenH },
  catCard: { width: '47.5%', minHeight: 116, borderRadius: Radii.card, overflow: 'hidden', padding: 16, justifyContent: 'flex-end', ...Shadows.card },
  catGlyph: { position: 'absolute', top: -6, right: -2, fontSize: 58, opacity: 0.9 },
  catName: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 18, color: '#fff', lineHeight: 20, zIndex: 2 },
  catCount: { marginTop: 5, alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.26)' },
  catCountNone: { backgroundColor: 'rgba(0,0,0,0.16)' },
  catCountText: { fontSize: 12.5, fontWeight: '600', color: '#fff' },
  featCard: { width: 230, backgroundColor: Colors.surface, borderRadius: Radii.card, overflow: 'hidden', ...Shadows.card },
  featPhoto: { height: 124, position: 'relative' },
  featBadge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  featBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  featHeart: { position: 'absolute', top: 8, right: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  featHeartText: { fontSize: 17, color: Colors.ink2 },
  heartOn: { color: Colors.fairs },
  featBody: { padding: 11 },
  featTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16, color: Colors.ink, lineHeight: 19 },
  featMeta: { fontSize: 12.5, color: Colors.muted, fontWeight: '600', marginTop: 4 },
});
