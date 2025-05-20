import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const matches = useSyncExternalStore(
    callback => subscribe(query, callback),
    () => getSnapshot(query),
    getServerSnapshot,
  );

  return matches;
}

function getSnapshot(query: string) {
  return window.matchMedia(query).matches;
}

function subscribe(
  query: string,
  callback: (event: MediaQueryListEvent) => void,
) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);

  return () => {
    mql.removeEventListener("change", callback);
  };
}

function getServerSnapshot() {
  return false;
}
