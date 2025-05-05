import { atom } from "jotai";
import { doAPIGetRequest } from "@/api";
import { SpecVersion, Version } from "@/types";

type StateViewerView = "env" | "heap" | "callstack" | "bp" | "stats";

export const clientActiveViewerAtom = atom<StateViewerView>("env");
export const clientActiveAddrAtom = atom<string | null>(null);

export const versionAtom = atom<Promise<Version>>(async () => {
  const rawSpec = (await doAPIGetRequest(`spec/version`)) as SpecVersion;
  const rawESMeta = (await doAPIGetRequest(`meta/version`)) as string;

  return {
    spec: rawSpec,
    esmeta: rawESMeta,
    client: __APP_VERSION__,
  } satisfies Version;
});
