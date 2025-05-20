import { FALLBACK_CODE, SEARCHPARAM_NAME_PROG } from "@/constants";
import { AppState } from "@/types";
import { getSearchQuery } from "@/utils";
import { atom } from "jotai";
import { resultAtom } from "./state";

export const appState = atom<AppState>(AppState.INIT);

export const ignoreBPAtom = atom<boolean>(false);
export const jsCodeAtom = atom<string>(
  getSearchQuery(SEARCHPARAM_NAME_PROG) ?? FALLBACK_CODE,
);
export const devModeAtom = atom<boolean>(import.meta.env.DEV);
export const highlightVisitedAtom = atom<boolean>(false);
export const busyAtom = atom<number | null>(null);

// TODO refactor with loadable
export const busyStateGetter = atom(get => {
  const [isPending] = get(resultAtom);
  const x = get(busyAtom);
  const isInit = get(appState) === AppState.INIT;

  if (x !== null && x < 0) return "not_connected";

  if (x === null || x > 0 || isPending) {
    return isInit ? "init" : "busy";
  }

  return "connected";
});
