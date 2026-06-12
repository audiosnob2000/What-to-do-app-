import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    <View style={[styles.container, { backgroundColor: cat.g1 }, style]}>
      <Text style={[styles.glyph, { fontSize: glyphSize }]}>{cat.glyph}</Text>
      {children}
    </View>
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
