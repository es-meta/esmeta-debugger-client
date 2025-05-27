import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value);
  const previous = ref.current;

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return previous;
}
