import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YouScreen } from '../../src/components/YouScreen';
import { useApp } from '../_layout';
import { Colors } from '../../src/theme/tokens';

export default function YouTab() {
  const { location, radius, saved, interests, toggleInterest, notif, setNotif } = useApp();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <YouScreen
        location={location}
        radius={radius}
        savedCount={saved.length}
        interests={interests}
        toggleInterest={toggleInterest}
        notif={notif}
        setNotif={setNotif}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: Colors.bg } });
