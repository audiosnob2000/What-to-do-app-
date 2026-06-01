import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    AsyncStorage.getItem('wtd_' + key).then(raw => {
      if (raw != null) {
        try { setValue(JSON.parse(raw)); } catch {}
      }
    });
  }, [key]);

  const set = (val: T) => {
    setValue(val);
    AsyncStorage.setItem('wtd_' + key, JSON.stringify(val));
  };

  return [value, set];
}
