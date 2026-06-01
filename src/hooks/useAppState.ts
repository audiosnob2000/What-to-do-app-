import { useStorage } from './useStorage';
import { CategoryId } from '../data';

export interface LocationState {
  label: string;
  short: string;
  viaGps: boolean;
}

const DEFAULT_LOCATION: LocationState = {
  label: 'Rocky Point, NY 11778',
  short: 'Rocky Point',
  viaGps: false,
};

export function useAppState() {
  const [radius, setRadius] = useStorage<number>('radius', 15);
  const [location, setLocation] = useStorage<LocationState>('location', DEFAULT_LOCATION);
  const [saved, setSaved] = useStorage<number[]>('saved', []);
  const [interests, setInterests] = useStorage<CategoryId[]>('interests', ['music', 'festivals', 'food']);
  const [notif, setNotif] = useStorage<boolean>('notif', true);
  const [locPerm, setLocPerm] = useStorage<'unknown' | 'granted' | 'denied'>('locPerm', 'unknown');

  const toggleSave = (id: number) => {
    setSaved(saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]);
  };

  const toggleInterest = (id: CategoryId) => {
    setInterests(interests.includes(id) ? interests.filter(x => x !== id) : [...interests, id]);
  };

  return {
    radius, setRadius,
    location, setLocation,
    saved, toggleSave,
    interests, toggleInterest,
    notif, setNotif,
    locPerm, setLocPerm,
  };
}
