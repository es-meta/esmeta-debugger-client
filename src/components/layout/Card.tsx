import { forwardRef, Ref, type ReactNode } from "react";
import { cn } from "@/utils";

interface Props {
  className?: string;
  children?: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

// TODO : remove forwardRef when upgrading to React 19
export default forwardRef(function Card(
  { className, children }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <article ref={ref} className={cn("flex flex-col relative", className)}>
      {children}
    </article>
  );
});
