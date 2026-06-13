import { CategoryId } from '../data';

export interface LiveEvent {
  id: number;
  cat: CategoryId;
  title: string;
  venue: string;
  day: string;
  dist: number;
  price: number;
  about: string;
  source: 'fsq';
}

const FSQ_API_KEY = 'HULIE4YNBVFPFCTQRTCF4OCQGQBU0FJ54155HHLKDZAER2C0';
const FSQ_BASE_URL = 'https://api.foursquare.com/v3/places/search';

const CATEGORY_MAP: Record<CategoryId, number> = {
  food:      13000,
  music:     10032,
  sports:    18000,
  family:    12000,
  craft:     11100,
  fairs:     10000,
  festivals: 10000,
  yardsale:  11100,
};

export async function fetchFoursquarePlaces(
  lat: number,
  lng: number,
  radiusMiles: number,
  category: CategoryId,
): Promise<LiveEvent[]> {
  const radiusMeters = Math.round(radiusMiles * 1609);
  const fsqCategoryId = CATEGORY_MAP[category];

  const targetUrl = `${FSQ_BASE_URL}?ll=${lat},${lng}&radius=${radiusMeters}&categories=${fsqCategoryId}&limit=10&sort=DISTANCE`;
  const proxiedUrl = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;

  const response = await fetch(proxiedUrl, {
    headers: {
      Authorization: FSQ_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Foursquare API error: ${response.status}`);
  }

  const data = await response.json();
  const results: any[] = data.results ?? [];

  return results.map((place, index): LiveEvent => ({
    id: index,
    cat: category,
    title: place.name ?? 'Unknown Place',
    venue: place.location?.formatted_address || place.location?.locality || '',
    day: 'Open Now',
    dist: place.distance ? place.distance / 1609 : 0,
    price: 0,
    about: place.categories?.[0]?.name || '',
    source: 'fsq',
  }));
}
