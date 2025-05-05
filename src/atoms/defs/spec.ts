import { doAPIGetRequest } from "@/api";
import type { IrToSpecMapping } from "@/types";
import { atom } from "jotai";

export const nameMapAtom = atom<Promise<Record<string, number>>>(async () => {
  const raw = (await doAPIGetRequest(`spec/func`)) as [number, string][];
  const nameMap: Record<string, number> = {};
  raw.forEach(([fid, name]) => {
    nameMap[name] = fid;
  });

  return nameMap;
});

export const irToSpecNameMapAtom = atom(async () => {
  const raw2 = (await doAPIGetRequest(`spec/irToSpecNameMap`)) as [
    string,
    IrToSpecMapping[string],
  ][];

  const irToSpecMapping: IrToSpecMapping = {};
  raw2.forEach(([ir, info]) => {
    irToSpecMapping[ir] = info !== undefined ? info : undefined;
  });

  return raw2;
});
