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
        nameForContext: replacedNameForContext(name, info ?? undefined),
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

function replacedNameForCallstackContext(
  name: string,
  specInfo: SpecFuncInfo | undefined,
): string {
  if (specInfo?.isBuiltIn) {
    return withPrefixRemoved(name);
  }
  if (specInfo?.isSdo && specInfo?.sdoInfo && specInfo?.sdoInfo.prod) {
    return `${specInfo.sdoInfo.method} of ${specInfo.sdoInfo.prod?.astName}`;
  }
  if (specInfo?.methodInfo) {
    return specInfo.methodInfo[1];
  }
  if (specInfo?.isClo) {
    return `Abstract Closure captured at ${withPrefixRemoved(specInfo.normalizedName)}`;
  }
  if (specInfo?.isCont) {
    return `Continuation captured at ${withPrefixRemoved(specInfo.normalizedName)}`;
  }
  return name;
}

function replacedNameForContext(
  name: string,
  specInfo: SpecFuncInfo | undefined,
): string {
  if (specInfo?.sdoInfo && specInfo.isSdo === true) {
    return specInfo.sdoInfo.method;
  }

  if (specInfo?.isBuiltIn === true) {
    return withPrefixRemoved(name);
  }

  if (specInfo?.methodInfo) {
    const [, mn] = specInfo.methodInfo;
    return mn;
  }
  if (specInfo?.isClo || specInfo?.isCont) {
    return withPrefixRemoved(specInfo.normalizedName);
  }
  return name;
}

function withPrefixRemoved(name: string): string {
  if (name.startsWith("INTRINSICS.")) {
    return name.substring("INTRINSICS.".length);
  }
  return name;
}
