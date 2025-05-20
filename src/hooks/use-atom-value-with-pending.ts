import { resultAtom } from "@/atoms/defs/state";
import { Atom, useAtomValue } from "jotai";
import { unwrap } from "jotai/utils";
import { useMemo, useState } from "react";

export function useLastResolvedAtomValue<T>(
  atom: Atom<Promise<T>>,
  initialFallback: T,
): [boolean, T] {
  const [initial] = useState(initialFallback);
  const [isPending] = useAtomValue(resultAtom);
  const x = useMemo(
    () => unwrap(atom, prev => prev ?? initial),
    [atom, initial],
  );
  const value = useAtomValue(x);
  return [isPending || value === initial, value] satisfies [boolean, T];
}
