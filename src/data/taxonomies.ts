export const MEAL_TYPES = [
  { label: 'Ontbijt/Lunch', slug: 'ontbijt-lunch' },
  { label: 'Voorgerechten', slug: 'voorgerechten' },
  { label: 'Hoofdgerechten', slug: 'hoofdgerechten' },
  { label: 'Bijgerechten', slug: 'bijgerechten' },
  { label: 'Desserts', slug: 'desserts' },
  { label: 'Snacks', slug: 'snacks' },
] as const;

export const KENMERKEN = [
  { label: 'Vlees', slug: 'vlees' },
  { label: 'Vis', slug: 'vis' },
  { label: 'Kip', slug: 'kip' },
  { label: 'Vega', slug: 'vega' },
  { label: 'Pasta', slug: 'pasta' },
  { label: 'Rijst', slug: 'rijst' },
  { label: 'Aardappel', slug: 'aardappel' },
  { label: 'Ei', slug: 'ei' },
  { label: 'Zoet', slug: 'zoet' },
  { label: 'Ovengerecht', slug: 'ovengerecht' },
] as const;

export const DIFFICULTIES = ['Makkelijk', 'Gemiddeld', 'Moeilijk'] as const;

export type MealType = (typeof MEAL_TYPES)[number]['label'];
export type Kenmerk = (typeof KENMERKEN)[number]['label'];
export type Difficulty = (typeof DIFFICULTIES)[number];

export const mealTypeLabels = MEAL_TYPES.map(({ label }) => label) as [MealType, ...MealType[]];
export const kenmerkLabels = KENMERKEN.map(({ label }) => label) as [Kenmerk, ...Kenmerk[]];
