import { Suspense, useEffect, useState } from "react";
import { requestIdleCallback } from "@/lib/polyfills";

interface Props {
  children: React.ReactNode;
  loading?: React.ReactNode;
}

export function DeferUntilIdle({ children, loading: fallback }: Props) {
  const [lazyTrue, setLazyTrue] = useState<boolean>(false);

  useEffect(() => {
    requestIdleCallback(() => setLazyTrue(true));
  }, []);

  return <Suspense fallback={fallback}>{lazyTrue ? children : null}</Suspense>;
}
