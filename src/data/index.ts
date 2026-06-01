export type CategoryId = 'fairs' | 'music' | 'festivals' | 'craft' | 'food' | 'family' | 'yardsale' | 'sports';
export type WhenFilter = 'today' | 'weekend' | 'nextweek';

export interface Category {
  id: CategoryId;
  name: string;
  glyph: string;
  color: string;
  g1: string;
  g2: string;
}

export interface Event {
  id: number;
  cat: CategoryId;
  title: string;
  venue: string;
  when: WhenFilter;
  day: string;
  dist: number;
  price: number;
  about: string;
}

export const CATEGORIES: Category[] = [
  { id: 'fairs',     name: 'Fairs & Carnivals',    glyph: '🎡', color: '#F0476B', g1: '#FF6F91', g2: '#E0204F' },
  { id: 'music',     name: 'Live Music',            glyph: '🎸', color: '#C0398B', g1: '#D85BB0', g2: '#9B1E72' },
  { id: 'festivals', name: 'Festivals',             glyph: '🎉', color: '#F1542A', g1: '#FF7A45', g2: '#E03E12' },
  { id: 'craft',     name: 'Craft Fairs',           glyph: '🧶', color: '#1B9C85', g1: '#2FC6A8', g2: '#0E7D68' },
  { id: 'food',      name: 'Food & Drink',          glyph: '🍔', color: '#E0930F', g1: '#F4B23E', g2: '#C9760A' },
  { id: 'family',    name: 'Family & Kids',         glyph: '🎈', color: '#2D8FD5', g1: '#56AEE6', g2: '#1F73B8' },
  { id: 'yardsale',  name: 'Yard Sales',            glyph: '🏷️', color: '#7A5AF0', g1: '#9B7BFF', g2: '#5B3FD0' },
  { id: 'sports',    name: 'Sports & Recreation',   glyph: '🏀', color: '#1E9E54', g1: '#4FD37C', g2: '#138A45' },
];

export const CAT_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map(c => [c.id, c])
) as Record<CategoryId, Category>;

export const EVENTS: Event[] = [
  { id: 1,  cat: 'fairs',     title: 'Rocky Point Fire Dept. Carnival',      venue: 'Rocky Point Fire Department',             when: 'weekend',  day: 'Thu–Sun · 6–11pm',        dist: 0.8,  price: 0,  about: "The town's favorite summer tradition is back — Ferris wheel, midway games, fried dough and the fire trucks on display. Free to walk in; ride-all-night wristbands are $30 at the gate." },
  { id: 2,  cat: 'fairs',     title: 'Shoreham–Wading River Street Fair',    venue: 'Route 25A, Wading River',                 when: 'weekend',  day: 'Sat · 10am–5pm',          dist: 6.0,  price: 0,  about: 'Main-street fair with kiddie rides, a petting zoo, classic cars and dozens of local vendors lining 25A. Free admission and free parking behind the firehouse.' },
  { id: 3,  cat: 'fairs',     title: 'Cedar Beach Summer Carnival',          venue: 'Cedar Beach, Mount Sinai',                when: 'today',    day: 'Tonight · 5–10pm',        dist: 5.0,  price: 5,  about: 'A seaside carnival on the Mount Sinai harbor with thrill rides, boardwalk games and a fireworks finale over the Sound at 9:30. $5 entry; kids under 4 free.' },
  { id: 4,  cat: 'fairs',     title: 'Smith Point Beach Carnival',           venue: 'Smith Point County Park',                 when: 'nextweek', day: 'Next Fri–Sun',             dist: 14.0, price: 10, about: 'A travelling carnival right on the barrier beach — fun house, swings, and the big wheel with an ocean view. Ride wristbands available all weekend.' },
  { id: 5,  cat: 'music',     title: "Live Music at Tiki Joe's",             venue: "Tiki Joe's, Smith Point",                 when: 'today',    day: 'Tonight · 7pm',           dist: 14.0, price: 0,  about: 'Toes in the sand, drink in hand. A local band plays beachside reggae and classic rock as the sun goes down over the water. No cover — grab a frozen drink and a seat early.' },
  { id: 6,  cat: 'music',     title: "Live Band Saturdays at Painters'",     venue: "Painters' Restaurant",                    when: 'weekend',  day: 'Sat · 9pm',               dist: 12.0, price: 0,  about: "Painters' back room turns into a live music spot every Saturday night — blues, rock and the occasional open jam. No cover; full kitchen and bar till late." },
  { id: 7,  cat: 'music',     title: "Sunset Acoustic at Daisy's",          venue: "Daisy's",                                 when: 'today',    day: 'Tonight · 6pm',           dist: 1.5,  price: 0,  about: "A laid-back acoustic set on the patio at Daisy's — singer-songwriters and a few familiar covers. Free to listen; happy hour runs till 7." },
  { id: 8,  cat: 'music',     title: 'Concerts on the Harbor',              venue: 'Harborfront Park, Port Jefferson',        when: 'weekend',  day: 'Sun · 7pm',               dist: 9.0,  price: 0,  about: 'The free summer concert series on Port Jeff harbor. Bring a low chair or blanket and catch the breeze off the water. Food and ice cream a short walk away in the village.' },
  { id: 9,  cat: 'music',     title: 'Friday Nights at Baiting Hollow Vineyard', venue: 'Baiting Hollow Farm Vineyard',       when: 'weekend',  day: 'Fri · 6–9pm',             dist: 12.0, price: 10, about: 'Live music on the lawn among the vines with wine by the glass and a food truck on site. $10 lawn admission; bring chairs. 21+ after 6pm.' },
  { id: 10, cat: 'food',      title: 'Alive After Five Street Festival',     venue: 'Downtown Riverhead',                     when: 'weekend',  day: 'Thu · 5–9pm',             dist: 15.0, price: 0,  about: "East End's biggest street party — four blocks of food vendors, live bands on every corner and a classic car show. Free to wander; pay as you eat." },
  { id: 11, cat: 'food',      title: 'Cedar Beach Clambake',                venue: 'Cedar Beach, Mount Sinai',               when: 'weekend',  day: 'Sat · 4pm',               dist: 5.0,  price: 45, about: 'A proper Long Island clambake on the sand — steamers, lobster, corn and a bonfire to follow. Ticket covers your full plate; BYO beach blanket.' },
  { id: 12, cat: 'food',      title: 'North Fork Food Truck & Beer Fest',   venue: 'Calverton',                              when: 'weekend',  day: 'Sat–Sun · 12–6pm',        dist: 14.0, price: 20, about: 'Twenty food trucks and a tent full of Long Island craft brewers, plus live music all afternoon. $20 entry includes a tasting glass; food sold separately.' },
  { id: 13, cat: 'food',      title: "Taco & Margarita Night at Tiki Joe's", venue: "Tiki Joe's, Smith Point",               when: 'today',    day: 'Tonight · 5pm',           dist: 14.0, price: 0,  about: 'Beachfront taco specials and frozen margaritas with a DJ on the deck. Free to come down; pay at the bar. Best seats are on the sand before sunset.' },
  { id: 14, cat: 'food',      title: 'Food Truck Friday',                   venue: 'Diamond in the Pines, Coram',            when: 'weekend',  day: 'Fri · 5–9pm',             dist: 9.0,  price: 0,  about: 'A rotating lineup of local food trucks in the park, plus a bounce house and live music for the family. Free admission and parking.' },
  { id: 15, cat: 'yardsale',  title: 'Rocky Point Community-Wide Yard Sale', venue: 'Throughout Rocky Point',               when: 'weekend',  day: 'Sat · 8am–2pm',           dist: 0.5,  price: 0,  about: 'Dozens of homes across the neighborhood put their driveways out at once — furniture, tools, toys, beach gear and vintage finds. Grab a map at the deli and bring small bills.' },
  { id: 16, cat: 'yardsale',  title: 'Sound Beach Multi-Family Garage Sale', venue: 'New York Ave, Sound Beach',            when: 'weekend',  day: 'Sat–Sun · 9am',           dist: 1.8,  price: 0,  about: "Six families on one block clearing out kids' gear, kitchen items, sporting goods and electronics. Early birds welcome; most everything priced to move." },
  { id: 17, cat: 'yardsale',  title: 'Miller Place Historical Society Tag Sale', venue: 'Miller Place–Mount Sinai Historical Society', when: 'today', day: 'Today · 9am–3pm', dist: 3.0, price: 0, about: 'Antiques, collectibles, books and household treasures donated to support the society. Half-price fill-a-bag after 1pm. Cash only.' },
  { id: 18, cat: 'yardsale',  title: 'Wading River Block Yard Sale',        venue: 'North Wading River Rd',                  when: 'nextweek', day: 'Next Sat · 8am–1pm',      dist: 6.0,  price: 0,  about: 'A long-running annual block sale near the beach with a little of everything. Coffee and a bake sale table set up at the corner.' },
  { id: 19, cat: 'festivals', title: 'Port Jefferson Summer Festival',       venue: 'Village of Port Jefferson',              when: 'weekend',  day: 'Sat–Sun',                 dist: 9.0,  price: 0,  about: 'The harbor village fills with craft and food booths, street performers and live music on two stages. Free; ferry-watching and ice cream included by default.' },
  { id: 20, cat: 'festivals', title: 'Smith Point Fireworks Festival',       venue: 'Smith Point County Park',                when: 'weekend',  day: 'Sat · 6pm',               dist: 14.0, price: 0,  about: "A beach festival building up to one of the South Shore's biggest fireworks shows over the ocean. Food vendors and a DJ on the boardwalk beforehand. Free; parking fills early." },
  { id: 21, cat: 'festivals', title: 'Shoreham Strawberry Festival',         venue: 'Shoreham Village Green',                 when: 'nextweek', day: 'Next weekend',             dist: 3.2,  price: 0,  about: "A small-town summer classic — strawberry shortcake, craft vendors, a kids' zone and live bluegrass on the green. Free admission." },
  { id: 22, cat: 'craft',     title: 'Rocky Point VFW Craft Fair',           venue: 'VFW Post 6249, Rocky Point',             when: 'weekend',  day: 'Sun · 10am–4pm',          dist: 1.0,  price: 0,  about: 'Forty local makers selling candles, jewelry, woodwork and beach-themed art in and around the post hall. Free entry; food truck out front.' },
  { id: 23, cat: 'craft',     title: 'North Shore Makers Market',            venue: 'Harborfront Park, Port Jefferson',        when: 'weekend',  day: 'Sat · 10am–5pm',          dist: 9.0,  price: 0,  about: 'An open-air market of Long Island artisans right on the harbor — ceramics, prints, soaps and textiles, with live acoustic music. Free to browse.' },
  { id: 24, cat: 'family',    title: 'Movie Night on the Beach',             venue: 'Cedar Beach, Mount Sinai',               when: 'weekend',  day: 'Fri · 8:30pm',            dist: 5.0,  price: 0,  about: 'A family movie on the big inflatable screen right on the sand at dusk. Free; bring chairs, blankets and bug spray. Snack stand open till the credits.' },
  { id: 25, cat: 'family',    title: 'Long Island Aquarium Day',             venue: 'Long Island Aquarium, Riverhead',        when: 'weekend',  day: 'Sat–Sun · 10am–5pm',      dist: 15.0, price: 30, about: 'Sharks, sea lions and the big reef tank, plus summer touch-tanks and feedings. Tickets at the door or online; combo passes with the river cruise available.' },
  { id: 26, cat: 'family',    title: 'Splish Splash Water Park',             venue: 'Splish Splash, Calverton',               when: 'today',    day: 'Open daily · 10am',       dist: 14.0, price: 50, about: "Long Island's big water park — slides, a lazy river and a kiddie lagoon. Day tickets cheaper online; arrive early on hot summer weekends." },
  { id: 27, cat: 'sports',    title: 'Pine Barrens Trail Hike',              venue: 'Rocky Point Pine Barrens Preserve',      when: 'weekend',  day: 'Sat · 9am',               dist: 1.5,  price: 0,  about: 'A free guided morning hike through the Rocky Point preserve — flat, shaded trails and great for all ages and dogs on leash. Meet at the Route 25A trailhead lot.' },
  { id: 28, cat: 'sports',    title: 'Kayak the Sound',                      venue: 'Cedar Beach Launch, Mount Sinai',        when: 'weekend',  day: 'Sun · 10am & 2pm',        dist: 5.0,  price: 40, about: 'A guided two-hour paddle along the Sound shoreline. Kayaks, paddles and life vests provided; suitable for beginners ages 12+. Reserve a spot ahead.' },
  { id: 29, cat: 'sports',    title: 'Beach Volleyball at Smith Point',      venue: 'Smith Point County Park',                when: 'today',    day: 'Tonight · 5:30pm',        dist: 14.0, price: 0,  about: 'Casual pickup beach volleyball by the pavilion — all skill levels, nets up and teams sorted on the spot. Free; just bring water and sunscreen.' },
  { id: 30, cat: 'sports',    title: 'Sunrise Surfcasting Clinic',           venue: 'Smith Point County Park',                when: 'nextweek', day: 'Next Sat · 6am',          dist: 14.0, price: 20, about: 'Learn the basics of surf fishing from a local guide — gear provided, bait included. A small fee covers the rod rental; bring a beach permit if you have one.' },
];
