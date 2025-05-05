import type { ReactNode } from "react";
import { cn } from "@/utils";

interface Props {
  className?: string;
  children?: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export default function Card({ className, children, ref }: Props) {
  return (
    <article ref={ref} className={cn("flex flex-col relative", className)}>
      {children}
    </article>
  );
}
