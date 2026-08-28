export const MEAL_TYPES = [
  { label: 'Ontbijt/Lunch', slug: 'ontbijt-lunch' },
  { label: 'Voorgerechten', slug: 'voorgerechten' },
  { label: 'Hoofdgerechten', slug: 'hoofdgerechten' },
  { label: 'Bijgerechten', slug: 'bijgerechten' },
  { label: 'Desserts', slug: 'desserts' },
  { label: 'Snacks', slug: 'snacks' },
] as const;

export const KENMERKEN = [
  { label: 'Kip', slug: 'kip' },
  { label: 'Gehakt', slug: 'gehakt' },
  { label: 'Vis', slug: 'vis' },
  { label: 'Vega', slug: 'vega' },
  { label: 'Soep', slug: 'soep' },
  { label: 'Pasta', slug: 'pasta' },
  { label: 'Rijst', slug: 'rijst' },
  { label: 'Ovengerecht', slug: 'ovengerecht' },
  { label: 'Aardappel', slug: 'aardappel' },
  { label: 'Ei', slug: 'ei' },
] as const;

export const DIFFICULTIES = ['Makkelijk', 'Gemiddeld', 'Moeilijk'] as const;

export type MealType = (typeof MEAL_TYPES)[number]['label'];
export type Kenmerk = (typeof KENMERKEN)[number]['label'];
export type Difficulty = (typeof DIFFICULTIES)[number];

export const mealTypeLabels = MEAL_TYPES.map(({ label }) => label) as [MealType, ...MealType[]];
export const kenmerkLabels = KENMERKEN.map(({ label }) => label) as [Kenmerk, ...Kenmerk[]];
