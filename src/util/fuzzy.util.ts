import { Fzf } from 'fzf'

export const fuzzyFilter = (source: string[], query: string, threshold: number): string[] => {
  const fzf = new Fzf(source)
  return fzf.find(query).filter(r => r.score > threshold).sort((a, b) => b.score - a.score).map(r => r.item)
}