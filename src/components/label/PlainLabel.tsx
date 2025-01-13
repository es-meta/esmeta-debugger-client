import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PlainLabel({ children, className }: Props) {
  return (
    <div
      className={twMerge(
        "flex flex-row items-center gap-[2px] px-1 py-1",
        "transition-all",
        "[&>svg]:size-4",
        "uppercase text-xs font-500 text-neutral-600",
        className,
      )}
    >
      {children}
    </div>
  );
}
