import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SavedScreen } from '../../src/components/SavedScreen';
import { useApp } from '../_layout';
import { Colors } from '../../src/theme/tokens';

export default function SavedTab() {
  const { saved, toggleSave } = useApp();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SavedScreen saved={saved} toggleSave={toggleSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: Colors.bg } });
