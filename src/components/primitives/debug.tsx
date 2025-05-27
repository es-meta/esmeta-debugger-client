import type { PropsWithChildren } from "react";
import { useAtomValue } from "jotai";
import { devModeAtom } from "@/atoms/defs/app";

export function Debug({ children }: PropsWithChildren) {
  const devMode = useAtomValue(devModeAtom);
  if (devMode) {
    return children;
  }
  return null;
}
