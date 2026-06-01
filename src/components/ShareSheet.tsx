import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Share, ScrollView } from 'react-native';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { Event, CAT_MAP } from '../data';
import { Colors, Radii } from '../theme/tokens';

const SHARE_TARGETS = [
  { id: 'messages',  label: 'Messages', glyph: '💬', colors: ['#5BE266', '#28C13B'] as const },
  { id: 'mail',      label: 'Mail',     glyph: '✉️', colors: ['#5BB8FF', '#1E7BE0'] as const },
  { id: 'whatsapp',  label: 'WhatsApp', glyph: '📱', colors: ['#5BE266', '#1FA855'] as const },
  { id: 'instagram', label: 'Stories',  glyph: '📸', colors: ['#FEC163', '#E1306C'] as const },
  { id: 'facebook',  label: 'Facebook', glyph: '👍', colors: ['#4D8BF0', '#1A5FD0'] as const },
];

interface Props {
  ev: Event | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export function ShareSheet({ ev, onClose, onToast }: Props) {
  if (!ev) return null;
  const shareText = `Check out "${ev.title}" — ${ev.day} at ${ev.venue}. Found it on What To Do Nearby!`;

  const handleNativeShare = async () => { onClose(); try { await Share.share({ message: shareText }); } catch {} };
  const handleTarget = (label: string) => { onClose(); onToast(`Sharing to ${label}…`); };
  const handleCopy = () => { onClose(); onToast('Link copied to clipboard'); };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grab} />
        <Text style={styles.heading}>Share this event</Text>
        <View style={styles.preview}>
          <View style={styles.previewThumb}>
            <PhotoPlaceholder catId={ev.cat} glyphSize={22} style={StyleSheet.absoluteFill} />
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewTitle} numberOfLines={1}>{ev.title}</Text>
            <Text style={styles.previewMeta}>{ev.day} · {ev.venue}</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.appsRow} contentContainerStyle={{ gap: 14, paddingVertical: 4 }}>
          {SHARE_TARGETS.map(t => (
            <Pressable key={t.id} style={styles.appBtn} onPress={() => handleTarget(t.label)}>
              <View style={[styles.appIcon, { backgroundColor: t.colors[0] }]}>
                <Text style={styles.appGlyph}>{t.glyph}</Text>
              </View>
              <Text style={styles.appLabel}>{t.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.actions}>
          <Pressable style={styles.action} onPress={handleCopy}>
            <Text style={styles.actionIc}>🔗</Text>
            <Text style={styles.actionText}>Copy link</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={handleNativeShare}>
            <Text style={styles.actionIc}>💬</Text>
            <Text style={styles.actionText}>Send as text message</Text>
          </Pressable>
          <Pressable style={[styles.action, { borderBottomWidth: 0 }]} onPress={handleNativeShare}>
            <Text style={styles.actionIc}>⋯</Text>
            <Text style={styles.actionText}>More options…</Text>
            <Text style={[styles.actionText, { marginLeft: 'auto', color: Colors.muted }]}>›</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(30,18,10,0.42)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.2, shadowRadius: 40, elevation: 20 },
  grab: { width: 42, height: 5, backgroundColor: Colors.hair, borderRadius: 999, alignSelf: 'center', marginBottom: 14 },
  heading: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, color: Colors.ink, marginBottom: 14 },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair, borderRadius: Radii.cardSm, padding: 11, marginBottom: 18 },
  previewThumb: { width: 52, height: 52, borderRadius: 11, overflow: 'hidden' },
  previewInfo: { flex: 1, minWidth: 0 },
  previewTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16, color: Colors.ink, lineHeight: 20 },
  previewMeta: { fontSize: 12.5, color: Colors.muted, fontWeight: '600', marginTop: 3 },
  appsRow: { marginBottom: 16 },
  appBtn: { alignItems: 'center', gap: 7, width: 64 },
  appIcon: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 4 },
  appGlyph: { fontSize: 26 },
  appLabel: { fontSize: 11.5, fontWeight: '600', color: Colors.ink2, textAlign: 'center' },
  actions: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair, borderRadius: Radii.cardSm, overflow: 'hidden' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, borderBottomWidth: 1, borderBottomColor: Colors.hair2 },
  actionIc: { fontSize: 19, width: 24, textAlign: 'center', color: Colors.ink2 },
  actionText: { fontSize: 15, fontWeight: '700', color: Colors.ink },
});
