import type { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

interface Props {
  children: ReactNode;
}

export default function PlainLabel({ children }: Props) {
  return (
    <div
      className={twJoin(
        "flex flex-row items-center gap-[2px] px-3 py-2",
        "transition-all",
        "[&>svg]:size-3",
        "uppercase text-xs font-500 text-neutral-600",
      )}
    >
      {children}
    </div>
  );
}
