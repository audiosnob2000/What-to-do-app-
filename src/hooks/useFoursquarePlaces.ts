import { useState, useEffect } from 'react';
import { CategoryId } from '../data';
import { fetchFoursquarePlaces, LiveEvent } from '../services/foursquare';

export function useFoursquarePlaces(
  lat: number,
  lng: number,
  radiusMiles: number,
  category: CategoryId,
): { places: LiveEvent[]; loading: boolean } {
  const [places, setPlaces] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFoursquarePlaces(lat, lng, radiusMiles, category)
      .then(results => {
        if (!cancelled) setPlaces(results);
      })
      .catch(() => {
        if (!cancelled) setPlaces([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [lat, lng, radiusMiles, category]);

  return { places, loading };
}
