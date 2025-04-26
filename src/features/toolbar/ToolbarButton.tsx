"use client";

import { forwardRef, ReactElement, type ReactNode } from "react";
import { Button } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

interface Props {
  position?: "left" | "right" | "center" | "single";
  disabled?: boolean;
  icon: ReactElement<SVGElement>;
  label: ReactNode;
  onClick?: () => void;
  className?: string;
}

const ToolbarButton = forwardRef(function (
  {
    icon,
    label,
    disabled,
    onClick,
    position = "single",
    className = "",
  }: Props,
  ref?: React.ForwardedRef<HTMLButtonElement> | undefined,
) {
  return (
    <Button
      ref={ref}
      className={twMerge(
        "inline-flex flex-row items-center gap-[2px] px-2 py-[6px]",
        "bg-white border",
        "dark:bg-neutral-950",
        "transition-all",
        "[&>svg]:hidden [&>svg]:size-[10px] md:[&>svg]:block",
        "uppercase text-xs text-neutral-700 dark:text-neutral-300 font-400",
        disabled ? "active:border-red-500" : "active:scale-90",
        disabled
          ? "opacity-50 cursor-not-allowed line-through"
          : "hover:z-[1] hover:bg-neutral-200 hover:dark:bg-neutral-700",
        position === "left" ? "rounded-l-md" : "",
        position === "right" ? "rounded-r-md" : "",
        position === "center" ? "rounded-none" : "",
        position === "single" ? "rounded-md" : "",
        // "rounded-md w-full justify-between", // button group scenario
        "[&>span>b]:text-es-900",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
});

export default ToolbarButton;
