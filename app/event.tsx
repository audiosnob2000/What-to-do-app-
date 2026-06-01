import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { EventDetailScreen } from '../src/components/EventDetailScreen';
import { useApp } from './_layout';
import { EVENTS } from '../src/data';
import { Colors } from '../src/theme/tokens';

export default function EventRoute() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { saved, toggleSave, showToast, openShareSheet } = useApp();
  const ev = EVENTS.find(e => e.id === Number(eventId));
  if (!ev) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <EventDetailScreen
        ev={ev}
        saved={saved.includes(ev.id)}
        toggleSave={toggleSave}
        onToast={showToast}
        onShare={openShareSheet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: Colors.bg } });
