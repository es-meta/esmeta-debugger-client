'use client';

import { useEffect, useRef, useState } from "react";

export default function useUnwavering<T>(value: T, delay: number) {
  const [state, setState] = useState(value);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {

    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    
    timeout.current = setTimeout(() => {
      setState(value);
    }, delay);

    return () : void => (timeout.current === null) ? undefined : clearTimeout(timeout.current);

  }, [value, delay]);

  return state;
}
