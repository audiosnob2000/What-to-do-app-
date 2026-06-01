import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CAT_MAP, CategoryId } from '../data';

interface Props {
  catId: CategoryId;
  glyphSize?: number;
  style?: object;
  children?: React.ReactNode;
}

export function PhotoPlaceholder({ catId, glyphSize = 40, style, children }: Props) {
  const cat = CAT_MAP[catId];
  return (
    <LinearGradient
      colors={[cat.g1, cat.g2]}
      start={{ x: 0.13, y: 0.13 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <Text style={[styles.glyph, { fontSize: glyphSize }]}>{cat.glyph}</Text>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glyph: {
    opacity: 0.55,
  },
});
