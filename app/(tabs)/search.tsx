import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchScreen } from '../../src/components/SearchScreen';
import { useApp } from '../_layout';
import { Colors } from '../../src/theme/tokens';

export default function SearchTab() {
  const { radius, saved, toggleSave } = useApp();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SearchScreen radius={radius} saved={saved} toggleSave={toggleSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: Colors.bg } });
