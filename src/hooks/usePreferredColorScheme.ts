import { useCallback, useEffect } from "react";

type DisplayMode = "light" | "dark";

export function currentMode(): DisplayMode {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else {
    return "light";
  }
}

export function usePreferredColorScheme(
  callback: (displayMode: DisplayMode) => void,
) {
  const handleMediaQueryChange = useCallback((event: MediaQueryListEvent) => {
    const displayMode = event.matches ? "dark" : "light";
    callback(displayMode);
  }, []);

  return useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", handleMediaQueryChange);

    // Initial check
    callback(mediaQueryList.matches ? "dark" : "light");

    return () => {
      mediaQueryList.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);
}
