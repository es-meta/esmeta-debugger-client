import { atom } from "jotai";

type StateViewerView = "env" | "heap" | "callstack" | "bp" | "stats";

export const clientActiveViewerAtom = atom<StateViewerView>("env");
export const clientActiveAddrAtom = atom<string | null>(null);
