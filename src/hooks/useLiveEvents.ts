import { useState, useEffect } from 'react';
import { fetchNearbyEvents, LiveEvent } from '../services/ticketmaster';
import { CategoryId } from '../data';

const DEFAULT_LAT = 40.9232;
const DEFAULT_LNG = -72.9382;

export function useLiveEvents(lat: number, lng: number, radiusMiles: number, category?: CategoryId) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchNearbyEvents(lat || DEFAULT_LAT, lng || DEFAULT_LNG, radiusMiles, category)
      .then(data => { if (!cancelled) { setEvents(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [lat, lng, radiusMiles, category]);

  return { events, loading, error };
}
