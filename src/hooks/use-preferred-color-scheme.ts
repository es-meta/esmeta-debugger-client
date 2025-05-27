import { useMediaQuery } from "./use-media-query";

export function usePreferredColorScheme() {
  const prefers = useMediaQuery("(prefers-color-scheme: dark)");
  return prefers ? "dark" : "light";
}
