import { CategoryId } from '../data';

const API_KEY = 'G6xXhep6Iom4TKA3Zrdimr1ohyVju4ba';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export interface LiveEvent {
  id: string;
  title: string;
  venue: string;
  day: string;
  price: number | null;
  cat: CategoryId;
  url: string;
  image: string | null;
  dist: number | null;
}

function segmentToCategory(segment: string, genre: string): CategoryId {
  const s = segment.toLowerCase();
  const g = genre.toLowerCase();
  if (s.includes('music')) return 'music';
  if (s.includes('sport')) return 'sports';
  if (s.includes('family') || g.includes('family') || g.includes('children')) return 'family';
  if (g.includes('food') || g.includes('drink')) return 'food';
  if (g.includes('festival')) return 'festivals';
  if (g.includes('craft') || g.includes('fair')) return 'craft';
  return 'festivals';
}

function formatDate(dateStr: string, timeStr?: string): string {
  try {
    const date = new Date(dateStr + (timeStr ? 'T' + timeStr : ''));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      + (timeStr ? ' · ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '');
  } catch {
    return dateStr;
  }
}

export async function fetchNearbyEvents(
  lat: number,
  lng: number,
  radiusMiles: number,
  category?: CategoryId,
): Promise<LiveEvent[]> {
  const params = new URLSearchParams({
    apikey: API_KEY,
    latlong: `${lat},${lng}`,
    radius: String(Math.min(radiusMiles, 100)),
    unit: 'miles',
    size: '40',
    sort: 'date,asc',
  });

  if (category === 'music') params.set('classificationName', 'music');
  else if (category === 'sports') params.set('classificationName', 'sports');
  else if (category === 'family') params.set('classificationName', 'family');

  const res = await fetch(`${BASE_URL}/events.json?${params}`);
  if (!res.ok) throw new Error(`Ticketmaster error: ${res.status}`);
  const json = await res.json();

  const items = json._embedded?.events ?? [];
  return items.map((e: any): LiveEvent => {
    const segment = e.classifications?.[0]?.segment?.name ?? '';
    const genre = e.classifications?.[0]?.genre?.name ?? '';
    const venue = e._embedded?.venues?.[0]?.name ?? 'TBD';
    const dateStr = e.dates?.start?.localDate ?? '';
    const timeStr = e.dates?.start?.localTime;
    const minPrice = e.priceRanges?.[0]?.min ?? null;
    const image = e.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url
      ?? e.images?.[0]?.url ?? null;
    return {
      id: e.id,
      title: e.name,
      venue,
      day: formatDate(dateStr, timeStr),
      price: minPrice,
      cat: segmentToCategory(segment, genre),
      url: e.url ?? '',
      image,
      dist: e.distance ?? null,
    };
  });
}
