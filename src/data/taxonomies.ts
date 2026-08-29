export const MEAL_TYPES = [
  { label: 'Ontbijt/Lunch', slug: 'ontbijt-lunch' },
  { label: 'Voorgerechten', slug: 'voorgerechten' },
  { label: 'Hoofdgerechten', slug: 'hoofdgerechten' },
  { label: 'Desserts', slug: 'desserts' },
  { label: 'Overig', slug: 'overig' },
] as const;

export const KENMERKEN = [
  { label: 'Vlees', slug: 'vlees' },
  { label: 'Vis', slug: 'vis' },
  { label: 'Kip', slug: 'kip' },
  { label: 'Vega', slug: 'vega' },
  { label: 'Pasta', slug: 'pasta' },
  { label: 'Rijst', slug: 'rijst' },
  { label: 'Aardappel', slug: 'aardappel' },
  { label: 'Soep', slug: 'soep' },
  { label: 'Ei', slug: 'ei' },
  { label: 'Zoet', slug: 'zoet' },
  { label: 'Ovengerecht', slug: 'ovengerecht' },
] as const;

export type MealType = (typeof MEAL_TYPES)[number]['label'];
export type Kenmerk = (typeof KENMERKEN)[number]['label'];

export const mealTypeLabels = MEAL_TYPES.map(({ label }) => label) as [MealType, ...MealType[]];
export const kenmerkLabels = KENMERKEN.map(({ label }) => label) as [Kenmerk, ...Kenmerk[]];
