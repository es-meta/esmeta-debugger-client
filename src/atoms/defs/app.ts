import { AppState } from "@/types/";
import { atom } from "jotai";

export const devModeAtom = atom<boolean>(import.meta.env.DEV);

export const appStateAtom = atom<AppState>(AppState.INIT);
