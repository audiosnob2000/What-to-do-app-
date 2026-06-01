import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Radii } from '../theme/tokens';
import { LocationState } from '../hooks/useAppState';

const RECENTS: LocationState[] = [
  { label: 'Rocky Point, NY 11778',    short: 'Rocky Point',    viaGps: false },
  { label: 'Port Jefferson, NY 11777', short: 'Port Jefferson', viaGps: false },
  { label: 'Riverhead, NY 11901',      short: 'Riverhead',      viaGps: false },
  { label: 'Wading River, NY 11792',   short: 'Wading River',   viaGps: false },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (loc: LocationState) => void;
  onUseGps: () => void;
}

export function LocationSheet({ visible, onClose, onApply, onUseGps }: Props) {
  const [zip, setZip] = useState('');
  const slideAnim = useRef(new Animated.Value(400)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setZip('');
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      Animated.timing(slideAnim, { toValue: 400, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  const apply = () => {
    if (zip.length >= 5) {
      onApply({ label: 'ZIP ' + zip.slice(0, 5), short: zip.slice(0, 5), viaGps: false });
    } else {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetWrap} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.grab} />
          <Text style={styles.heading}>Where should we look?</Text>
          <View style={styles.zipField}>
            <Text style={styles.fieldIc}>⌗</Text>
            <TextInput ref={inputRef} style={styles.zipInput} keyboardType="number-pad" maxLength={5}
              placeholder="Enter ZIP code" placeholderTextColor={Colors.muted}
              value={zip} onChangeText={t => setZip(t.replace(/[^0-9]/g, ''))} />
          </View>
          <Pressable style={styles.useGps} onPress={onUseGps}>
            <Text style={styles.useGpsText}>◎  Use my current location</Text>
          </Pressable>
          <Text style={styles.recentLabel}>RECENT</Text>
          {RECENTS.map(r => (
            <Pressable key={r.label} style={styles.recentRow} onPress={() => onApply(r)}>
              <Text style={styles.recentIc}>📍</Text>
              <Text style={styles.recentText}>{r.label}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.applyBtn} onPress={apply}>
            <Text style={styles.applyText}>{zip.length >= 5 ? 'Search this ZIP' : 'Done'}</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(30,18,10,0.42)' },
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 36, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.2, shadowRadius: 40, elevation: 20 },
  grab: { width: 42, height: 5, backgroundColor: Colors.hair, borderRadius: 999, alignSelf: 'center', marginBottom: 14 },
  heading: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, color: Colors.ink, marginBottom: 14 },
  zipField: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.hair, borderRadius: Radii.button, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12 },
  fieldIc: { fontSize: 18, color: Colors.muted },
  zipInput: { flex: 1, fontSize: 17, fontWeight: '700', color: Colors.ink, letterSpacing: 1 },
  useGps: { backgroundColor: Colors.brandSoft, borderRadius: Radii.button, padding: 14, marginBottom: 18 },
  useGpsText: { color: Colors.brandInk, fontWeight: '800', fontSize: 15 },
  recentLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: Colors.muted, marginBottom: 8 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: Colors.hair2 },
  recentIc: { fontSize: 16, color: Colors.muted },
  recentText: { fontSize: 15, fontWeight: '600', color: Colors.ink },
  applyBtn: { backgroundColor: Colors.brand, borderRadius: Radii.button, padding: 15, alignItems: 'center', marginTop: 18 },
  applyText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
