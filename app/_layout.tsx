import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
} from '@expo-google-fonts/hanken-grotesk';
import { useAppState } from '../src/hooks/useAppState';
import { LocationSheet } from '../src/components/LocationSheet';
import { ShareSheet } from '../src/components/ShareSheet';
import { Toast } from '../src/components/Toast';
import { Event } from '../src/data';
import { Colors } from '../src/theme/tokens';
import * as Location from 'expo-location';

import { createContext, useContext } from 'react';

export type AppContextType = ReturnType<typeof useAppState> & {
  showToast: (msg: string) => void;
  openLocationSheet: () => void;
  openShareSheet: (ev: Event) => void;
  requestGps: () => void;
  gpsLoading: boolean;
};

export const AppContext = createContext<AppContextType | null>(null);
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppContext');
  return ctx;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold,
  });

  const appState = useAppState();
  const [toast, setToast] = useState<string | null>(null);
  const [showLoc, setShowLoc] = useState(false);
  const [shareEv, setShareEv] = useState<Event | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const requestGps = useCallback(async () => {
    setShowLoc(false);
    if (appState.locPerm === 'granted') {
      await doLocate();
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      appState.setLocPerm('granted');
      await doLocate();
    } else {
      appState.setLocPerm('denied');
      showToast('No problem — enter a ZIP anytime');
    }
  }, [appState.locPerm]);

  const doLocate = async () => {
    setGpsLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      const label = geo ? `${geo.city}, ${geo.region} ${geo.postalCode}` : 'Your location';
      const short = geo?.city || 'Your location';
      appState.setLocation({ label, short, viaGps: true });
      showToast('📍 Found events near you');
    } catch {
      showToast('Could not get location — try a ZIP code');
    } finally {
      setGpsLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  const ctx: AppContextType = {
    ...appState,
    showToast,
    openLocationSheet: () => setShowLoc(true),
    openShareSheet: (ev) => setShareEv(ev),
    requestGps,
    gpsLoading,
  };

  return (
    <AppContext.Provider value={ctx}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="category" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="event" options={{ headerShown: false, animation: 'slide_from_right' }} />
        </Stack>

        <LocationSheet
          visible={showLoc}
          onClose={() => setShowLoc(false)}
          onApply={(loc) => { appState.setLocation(loc); setShowLoc(false); showToast('Location updated'); }}
          onUseGps={requestGps}
        />
        <ShareSheet ev={shareEv} onClose={() => setShareEv(null)} onToast={showToast} />
        {toast && <Toast message={toast} />}
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}
