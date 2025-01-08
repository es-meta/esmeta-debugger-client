import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  children?: ReactNode;
}

export default function Card({ className, children }: Props) {
  return (
    <div className={twMerge("bg-white max-h-full h-full rounded-xl flex flex-col overflow-y-scroll relative", className)}>
      {children}
    </div>
  );
}
