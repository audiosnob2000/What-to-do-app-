import React from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { CATEGORIES, CategoryId } from '../data';
import { Colors, Radii, Shadows, Spacing } from '../theme/tokens';
import { LocationState } from '../hooks/useAppState';

interface Props {
  location: LocationState;
  radius: number;
  savedCount: number;
  interests: CategoryId[];
  toggleInterest: (id: CategoryId) => void;
  notif: boolean;
  setNotif: (v: boolean) => void;
}

export function YouScreen({ location, radius, savedCount, interests, toggleInterest, notif, setNotif }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.greeting}>
        <Text style={styles.h1}>You</Text>
      </View>

      <View style={styles.youHead}>
        <View style={styles.avatar}><Text style={styles.avatarGlyph}>🙂</Text></View>
        <View>
          <Text style={styles.name}>Hey there</Text>
          <Text style={styles.sub}>{savedCount} saved · {location.short}</Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockHead}>Your interests</Text>
        <View style={styles.interestChips}>
          {CATEGORIES.map(c => (
            <Pressable key={c.id}
              style={[styles.chip, interests.includes(c.id) && styles.chipOn]}
              onPress={() => toggleInterest(c.id)}>
              <Text style={[styles.chipText, interests.includes(c.id) && styles.chipTextOn]}>
                {c.glyph} {c.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.hint}>We'll highlight these when you browse.</Text>
      </View>

      <View style={styles.block}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Default radius</Text>
          <Text style={[styles.rowVal, { color: Colors.brand }]}>{radius} mi</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Weekend alerts</Text>
          <Switch
            value={notif}
            onValueChange={setNotif}
            trackColor={{ false: Colors.hair, true: Colors.craft }}
            thumbColor="#fff"
          />
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.rowLabel}>Location</Text>
          <Text style={[styles.rowVal, { color: Colors.muted }]}>{location.label}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: 40 },
  greeting: { paddingHorizontal: Spacing.screenH, paddingTop: 8, paddingBottom: 4 },
  h1: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 30, color: Colors.ink, letterSpacing: -0.5 },
  youHead: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: Spacing.screenH, paddingTop: 10, paddingBottom: 4 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: Colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  avatarGlyph: { fontSize: 26 },
  name: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 22, color: Colors.ink },
  sub: { fontSize: 13, color: Colors.muted, fontWeight: '600' },
  block: {
    marginHorizontal: Spacing.screenH, marginTop: 18,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair,
    borderRadius: Radii.cardSm, padding: 16, ...Shadows.cardSm,
  },
  blockHead: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 15, color: Colors.ink, marginBottom: 12 },
  interestChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radii.pill, borderWidth: 1.5, borderColor: Colors.hair, backgroundColor: Colors.surface },
  chipOn: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  chipText: { fontSize: 13, fontWeight: '700', color: Colors.ink2 },
  chipTextOn: { color: '#fff' },
  hint: { fontSize: 12.5, color: Colors.muted, fontWeight: '600', marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.hair2 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: Colors.ink },
  rowVal: { fontSize: 14, fontWeight: '700' },
});
