import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { CAT_MAP, Event } from '../data';
import { Colors, Radii, Shadows } from '../theme/tokens';

interface Props {
  ev: Event;
  saved: boolean;
  onOpen: (id: number) => void;
  onToggleSave: (id: number) => void;
}

export function EventCard({ ev, saved, onOpen, onToggleSave }: Props) {
  const cat = CAT_MAP[ev.cat];
  const fmtPrice = (p: number) => p === 0 ? 'Free' : '$' + p;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.99 }] }]}
      onPress={() => onOpen(ev.id)}
    >
      <View style={styles.thumb}>
        <PhotoPlaceholder catId={ev.cat} glyphSize={34} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.tag, { color: cat.color }]}>{cat.name.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>{ev.title}</Text>
        <Text style={styles.when}>{ev.day}</Text>
        <View style={styles.footer}>
          <Text style={styles.dist}>{ev.dist} mi</Text>
          <Text style={[styles.price, ev.price > 0 && styles.pricePaid]}>
            {fmtPrice(ev.price)}
          </Text>
          <Pressable
            style={styles.heart}
            onPress={() => onToggleSave(ev.id)}
            hitSlop={8}
          >
            <Text style={[styles.heartText, saved && styles.heartOn]}>
              {saved ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
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
  thumb: {
    width: 92,
    height: 92,
    borderRadius: Radii.cardSm,
    overflow: 'hidden',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  tag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'BricolageGrotesque_700Bold',
    fontSize: 16.5,
    lineHeight: 20,
    marginTop: 3,
    color: Colors.ink,
  },
  when: {
    fontSize: 13,
    color: Colors.ink2,
    fontWeight: '600',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 'auto',
    paddingTop: 7,
  },
  dist: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.craft,
  },
  pricePaid: {
    color: Colors.brandInk,
  },
  heart: {
    marginLeft: 'auto',
  },
  heartText: {
    fontSize: 18,
    color: Colors.muted,
  },
  heartOn: {
    color: Colors.fairs,
  },
});
