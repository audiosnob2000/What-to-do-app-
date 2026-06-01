import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { CategoryListScreen } from '../src/components/CategoryListScreen';
import { useApp } from './_layout';
import { Colors } from '../src/theme/tokens';
import { CategoryId } from '../src/data';

export default function CategoryRoute() {
  const { catId } = useLocalSearchParams<{ catId: CategoryId }>();
  const { radius, location, saved, toggleSave } = useApp();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <CategoryListScreen
        catId={catId}
        radius={radius}
        location={location}
        saved={saved}
        toggleSave={toggleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: Colors.bg } });
