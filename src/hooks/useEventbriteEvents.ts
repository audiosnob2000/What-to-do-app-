import { useState, useEffect } from 'react';
import { fetchEventbriteEvents, EventbriteEvent } from '../services/eventbrite';

export function useEventbriteEvents(lat: number, lng: number, radiusMiles: number) {
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEventbriteEvents(lat || 40.9232, lng || -72.9382, radiusMiles)
      .then(data => { if (!cancelled) { setEvents(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [lat, lng, radiusMiles]);

  return { events, loading, error };
}
