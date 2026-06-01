export const Colors = {
  bg: '#FFF7EF',
  surface: '#FFFFFF',
  surface2: '#FBF1E6',
  ink: '#241C16',
  ink2: '#5C5048',
  muted: '#9A8C80',
  hair: '#ECE0D3',
  hair2: '#F2E9DD',

  brand: '#F1542A',
  brandInk: '#B83410',
  brandSoft: '#FDE6DC',

  fairs: '#F0476B',
  music: '#C0398B',
  festivals: '#F1542A',
  craft: '#1B9C85',
  food: '#E0930F',
  family: '#2D8FD5',
  yardsale: '#7A5AF0',
  sports: '#1E9E54',
} as const;

export const Radii = {
  card: 22,
  cardSm: 14,
  button: 14,
  pill: 999,
  icon: 999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#4A301C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 6,
  },
  cardSm: {
    shadowColor: '#4A301C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

export const Spacing = {
  screenH: 20,
  cardGap: 14,
  gridGap: 12,
} as const;
