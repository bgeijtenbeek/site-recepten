const dutchCollator = new Intl.Collator('nl-NL', {
  numeric: true,
  sensitivity: 'base',
});

function compareRecipeTitles(
  left: { id: string; title: string },
  right: { id: string; title: string },
): number {
  return dutchCollator.compare(left.title, right.title)
    || dutchCollator.compare(left.id, right.id);
}

export function sortRecipesByTitle<T extends { id: string; title: string }>(recipes: ReadonlyArray<T>): T[] {
  return [...recipes].sort(compareRecipeTitles);
}
