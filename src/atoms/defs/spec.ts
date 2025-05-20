import { doAPIGetRequest } from "@/api";
import type { AlgorithmKind, IrFunc, SpecFuncInfo } from "@/types";
import { atom } from "jotai";

export const irFuncsAtom = atom<Promise<Record<number, IrFunc>>>(async () => {
  const raw = (await doAPIGetRequest(`spec/func`)) as [
    number,
    [
      string,
      AlgorithmKind,
      [string, boolean, string][],
      string,
      SpecFuncInfo | undefined | null,
    ],
  ][];

  const entries: [number, IrFunc][] = raw.map(
    ([fid, [name, kind, rawParams, algoCode, info]]) => [
      fid,
      {
        fid,
        name,
        nameForBp: alternativeName(name, info ?? undefined),
        nameForCallstack: replacedNameForCallstackContext(
          name,
          info ?? undefined,
        ),
        kind,
        params: rawParams.map(([name, optional, type]) => ({
          name,
          optional,
          type,
        })),
        algoCode,
        info: info ?? undefined,
      },
    ],
  );

  return Object.fromEntries(entries);
});

export const funcNamesAtom = atom<Promise<string[]>>(async get => {
  const irFuncs = await get(irFuncsAtom);
  return Object.values(irFuncs).map(irFunc => irFunc.name);
});

function alternativeName(
  name: string,
  specInfo: SpecFuncInfo | undefined,
): string {
  if (specInfo?.isBuiltIn) {
    return `${name} ${name.substring("INTRINSICS.".length)}`;
  }
  if (specInfo?.isSdo && specInfo?.sdoInfo && specInfo?.sdoInfo.prod) {
    return `${name} ${specInfo.sdoInfo.method} of ${specInfo.sdoInfo.prod?.astName}`;
  }
  return name;
}

function replacedNameForCallstackContext(
  name: string,
  specInfo: SpecFuncInfo | undefined,
): string {
  if (specInfo?.isBuiltIn) {
    return name.substring("INTRINSICS.".length);
  }
  if (specInfo?.isSdo && specInfo?.sdoInfo && specInfo?.sdoInfo.prod) {
    return `${specInfo.sdoInfo.method} of ${specInfo.sdoInfo.prod?.astName}`;
  }
  if (specInfo?.methodInfo) {
    return specInfo.methodInfo[1];
  }
  return name;
}
