import { forwardRef, Ref, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

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
    <div
      ref={ref}
      className={twMerge(
        "flex flex-col bg-white dark:bg-neutral-950 relative",
        className,
      )}
    >
      {children}
    </div>
  );
});
