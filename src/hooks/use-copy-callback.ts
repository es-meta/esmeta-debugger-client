import { useCallback } from "react";
import { useTransient } from "@/hooks/use-transient";

type CopyTarget = ClipboardItems | string;

export function useCopyCallback(data: CopyTarget | (() => CopyTarget)) {
  const [isCopied, setCopied] = useTransient<boolean | null>(null, 1000);

  const callback = useCallback(() => {
    const dataResolved = typeof data === "function" ? data() : data;

    const promise =
      typeof dataResolved === "string"
        ? navigator.clipboard.writeText(dataResolved)
        : navigator.clipboard.write(dataResolved);

    promise.then(() => setCopied(true)).catch(() => setCopied(false));
  }, [data, setCopied]);

  return [isCopied, callback] as const;
}
