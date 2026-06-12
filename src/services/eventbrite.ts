import { CategoryId } from '../data';

const TOKEN = 'I2NWRTQS6FA36QAUIPYM';
const BASE_URL = 'https://www.eventbriteapi.com/v3';

export interface EventbriteEvent {
  id: string;
  title: string;
  venue: string;
  day: string;
  price: number | null;
  cat: CategoryId;
  url: string;
  isFree: boolean;
}

function categoryFromTags(name: string, format: string): CategoryId {
  const n = name.toLowerCase();
  const f = format.toLowerCase();
  if (n.includes('music') || n.includes('concert')) return 'music';
  if (n.includes('sport') || n.includes('fitness') || n.includes('outdoor')) return 'sports';
  if (n.includes('food') || n.includes('drink') || n.includes('beer') || n.includes('wine') || n.includes('culinary')) return 'food';
  if (n.includes('family') || n.includes('kid') || n.includes('child')) return 'family';
  if (n.includes('festival') || f.includes('festival')) return 'festivals';
  if (n.includes('fair') || n.includes('market') || n.includes('craft')) return 'craft';
  if (n.includes('art') || n.includes('theatre') || n.includes('film')) return 'festivals';
  return 'festivals';
}

function formatEB(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

export async function fetchEventbriteEvents(
  lat: number,
  lng: number,
  radiusMiles: number,
): Promise<EventbriteEvent[]> {
  const params = new URLSearchParams({
    token: TOKEN,
    'location.latitude': String(lat),
    'location.longitude': String(lng),
    'location.within': `${radiusMiles}mi`,
    expand: 'venue,category,format,ticket_availability',
    page_size: '40',
    sort_by: 'date',
  });

  const res = await fetch(`${BASE_URL}/events/search/?${params}`);
  if (!res.ok) throw new Error(`Eventbrite error: ${res.status}`);
  const json = await res.json();

  return (json.events ?? []).map((e: any): EventbriteEvent => {
    const catName = e.category?.name ?? '';
    const fmtName = e.format?.name ?? '';
    const venueName = e.venue?.name ?? e.venue?.address?.city ?? 'TBD';
    const isFree = e.is_free ?? false;
    const minPrice = e.ticket_availability?.minimum_ticket_price?.major_value
      ? parseFloat(e.ticket_availability.minimum_ticket_price.major_value)
      : null;
    return {
      id: e.id,
      title: e.name?.text ?? 'Event',
      venue: venueName,
      day: formatEB(e.start?.local ?? ''),
      price: isFree ? 0 : minPrice,
      cat: categoryFromTags(catName, fmtName),
      url: e.url ?? '',
      isFree,
    };
  });
}
