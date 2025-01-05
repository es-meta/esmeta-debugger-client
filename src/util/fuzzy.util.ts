import { Fzf } from "fzf";

export const fuzzyFilter = <T>(
  source: T[],
  query: string,
  threshold: number,
  extractor: (item: T) => string
): T[] => {
  
  const list = source.map((v) => ({ value: v, text: extractor(v) }));

  const fzf = new Fzf(list, { selector: (item) => item.text });
  return fzf
    .find(query)
    .filter(r => r.score > threshold)
    .sort((a, b) => b.score - a.score)
    .map(r => r.item.value);
};
