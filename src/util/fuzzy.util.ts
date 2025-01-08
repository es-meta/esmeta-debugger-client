import { Fzf } from "fzf";

export const fuzzyFilter = <T>(
  source: T[],
  query: string,
  threshold: number,
  extractor: (item: T) => string,
): T[] => {
  const list = source.map(v => ({ value: v, text: extractor(v) }));

  const fzf = new Fzf(list, {
    selector: item => item.text,
    casing: "case-insensitive",
  });
  return fzf
    .find(query)
    .filter(r => r.score > threshold)
    .sort((a, b) => {
      // Prioritize exact matches
      const aIsExact = a.item.text.toLowerCase() === query.toLowerCase();
      const bIsExact = b.item.text.toLowerCase() === query.toLowerCase();

      if (aIsExact && !bIsExact) return -1;
      if (!aIsExact && bIsExact) return 1;

      // Otherwise, sort by score
      return b.score - a.score;
    })
    .map(r => r.item.value);
};
