import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from '../../src/components/HomeScreen';
import { useApp } from '../_layout';
import { Colors } from '../../src/theme/tokens';

export default function BrowseTab() {
  const { location, radius, setRadius, openLocationSheet, requestGps, gpsLoading, saved, toggleSave } = useApp();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HomeScreen
        location={location}
        radius={radius}
        setRadius={setRadius}
        onOpenLocation={openLocationSheet}
        onUseGps={requestGps}
        gpsLoading={gpsLoading}
        saved={saved}
        toggleSave={toggleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
});
