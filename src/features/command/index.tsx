import { SuspenseBoundary, DeferUntilIdle } from "@/components/primitives";
import { lazy } from "react";

const CommandBar = lazy(() => import("./lazy/bar"));

export function CommandBarLazy() {
  return (
    <DeferUntilIdle>
      <SuspenseBoundary fatal>
        <CommandBar />
      </SuspenseBoundary>
    </DeferUntilIdle>
  );
}
