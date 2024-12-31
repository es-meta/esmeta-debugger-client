export function getSearchQuery(name: string): string | undefined {
  const x = new URLSearchParams(location.search).get(name);
  if (x === null) return undefined;
  return decodeURI(x);
}