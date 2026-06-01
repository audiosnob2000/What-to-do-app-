import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Share } from 'react-native';
import { router } from 'expo-router';
import { Event, CAT_MAP } from '../data';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { Colors, Radii, Shadows } from '../theme/tokens';

interface Props {
  ev: Event;
  saved: boolean;
  toggleSave: (id: number) => void;
  onToast: (msg: string) => void;
  onShare: (ev: Event) => void;
}

export function EventDetailScreen({ ev, saved, toggleSave, onToast, onShare }: Props) {
  const cat = CAT_MAP[ev.cat];
  const fmtPrice = (p: number) => p === 0 ? 'Free' : '$' + p;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.hero}>
          <PhotoPlaceholder catId={ev.cat} glyphSize={84} style={StyleSheet.absoluteFill} />
          <View style={styles.scrim} />
          <View style={styles.topbar}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
          </View>
          <View style={styles.htitle}>
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>{cat.name.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroTitle}>{ev.title}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <View style={styles.metaIcon}><Text style={styles.metaIcGlyph}>🗓</Text></View>
            <View>
              <Text style={styles.metaTitle}>{ev.day}</Text>
              <Text style={styles.metaSub}>Add to your calendar</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaIcon}><Text style={styles.metaIcGlyph}>📍</Text></View>
            <View>
              <Text style={styles.metaTitle}>{ev.venue}</Text>
              <Text style={styles.metaSub}>{ev.dist} miles away · tap for directions</Text>
            </View>
          </View>
          <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
            <View style={styles.metaIcon}><Text style={styles.metaIcGlyph}>🎫</Text></View>
            <View>
              <Text style={styles.metaTitle}>{fmtPrice(ev.price)}</Text>
              <Text style={styles.metaSub}>{ev.price ? 'Per person · tickets at the gate' : 'Free admission · no ticket needed'}</Text>
            </View>
          </View>
          <View style={styles.about}>
            <Text style={styles.aboutHead}>About this event</Text>
            <Text style={styles.aboutBody}>{ev.about}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable style={styles.btnPrimary} onPress={() => onToast('Opening directions…')}>
          <Text style={styles.btnPrimaryText}>Get directions</Text>
        </Pressable>
        <Pressable style={styles.btnGhost} onPress={() => onShare(ev)}>
          <Text style={styles.btnGhostText}>↑</Text>
        </Pressable>
        <Pressable style={[styles.btnGhost, saved && styles.btnGhostOn]} onPress={() => toggleSave(ev.id)}>
          <Text style={[styles.btnGhostText, saved && styles.btnGhostOnText]}>{saved ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  hero: { height: 280, position: 'relative' },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'transparent' },
  topbar: { position: 'absolute', top: 12, left: 14, right: 14, zIndex: 5 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22, color: Colors.ink, lineHeight: 26 },
  htitle: { position: 'absolute', left: 20, right: 20, bottom: 16, zIndex: 4 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)' },
  catBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  heroTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 27, color: '#fff', lineHeight: 30, marginTop: 9, textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  body: { padding: 18, paddingHorizontal: 20 },
  metaRow: { flexDirection: 'row', gap: 13, alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.hair2 },
  metaIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  metaIcGlyph: { fontSize: 18 },
  metaTitle: { fontSize: 15, fontWeight: '700', color: Colors.ink, lineHeight: 20 },
  metaSub: { fontSize: 13, color: Colors.muted, fontWeight: '600', marginTop: 1 },
  about: { marginTop: 18 },
  aboutHead: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 17, color: Colors.ink, marginBottom: 7 },
  aboutBody: { fontSize: 14.5, lineHeight: 24, color: Colors.ink2 },
  actionBar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 11, padding: 14, paddingBottom: 30, backgroundColor: Colors.bg },
  btnPrimary: { flex: 1, backgroundColor: Colors.brand, borderRadius: Radii.button, padding: 15, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnGhost: { width: 54, height: 54, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair, borderRadius: Radii.button, alignItems: 'center', justifyContent: 'center' },
  btnGhostOn: { borderColor: Colors.fairs, backgroundColor: '#FFF0F3' },
  btnGhostText: { fontSize: 20, color: Colors.ink },
  btnGhostOnText: { color: Colors.fairs },
});
