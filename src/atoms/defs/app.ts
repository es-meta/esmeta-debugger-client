import { AppState } from "@/types";
import { atom } from "jotai";

export const appState = atom<AppState>(AppState.INIT);
export const devModeAtom = atom<boolean>(import.meta.env.DEV);
export const highlightVisitedAtom = atom<boolean>(false);
export const busyAtom = atom<number | null>(null);
export const busyStateGetter = atom(get => {
  const x = get(busyAtom);
  const isInit = get(appState) === AppState.INIT;

  if (x === null) return "init";

  if (x === 0) {
    return "connected";
  }

  if (x > 0) {
    return isInit ? "init" : "busy";
  }

  return "not_connected";
});
