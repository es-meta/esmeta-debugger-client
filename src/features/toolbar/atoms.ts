import { AppState } from "@/types";
import { atom, ExtractAtomValue } from "jotai";
import { atoms } from "@/atoms";

export const selectorAtom = atom(get => {
  const appState = get(atoms.app.appState);
  const ignoreBP = get(atoms.app.ignoreBPAtom);
  const givenConfig = get(atoms.config.givenConfigAtom);
  return {
    disableRun: !(appState === AppState.JS_INPUT),
    disableResume: !(
      appState === AppState.JS_INPUT && givenConfig.origin.iter !== null
    ),
    disableQuit: appState === AppState.INIT || appState === AppState.JS_INPUT,
    disableGoingForward: !(
      appState === AppState.DEBUG_READY ||
      appState === AppState.DEBUG_READY_AT_FRONT
    ),
    disableGoingBackward: !(
      appState === AppState.DEBUG_READY || appState === AppState.TERMINATED
    ),
    ignoreBP,
  };
});

export type Selected = ExtractAtomValue<typeof selectorAtom>;
