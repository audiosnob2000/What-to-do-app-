import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CAT_MAP, CategoryId } from '../data';

let LinearGradient: any;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = null;
}

interface Props {
  catId: CategoryId;
  glyphSize?: number;
  style?: object;
  children?: React.ReactNode;
}

export function PhotoPlaceholder({ catId, glyphSize = 40, style, children }: Props) {
  const cat = CAT_MAP[catId];

  if (Platform.OS === 'web' || !LinearGradient) {
    return (
      <View style={[styles.container, { backgroundColor: cat.g1 }, style]}>
        <Text style={[styles.glyph, { fontSize: glyphSize }]}>{cat.glyph}</Text>
        {children}
      </View>
    );
  }

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
