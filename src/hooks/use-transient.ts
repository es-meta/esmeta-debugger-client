import { useEffect, useRef, useState } from "react";

export function useTransient<T>(origin: T, delay: number) {
  const [value, setValue] = useState<T>(origin);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== origin) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        setValue(origin);
      }, delay);
    }
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [value, origin, delay]);

  return [value, setValue] as const;
}
