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
  // children: ReactNode;
  bold?: boolean;
}

const ToolbarButton = forwardRef(function (
  {
    icon,
    label,
    disabled,
    onClick,
    position = "single",
    className = "",
    bold = false,
  }: Props,
  ref?: React.ForwardedRef<HTMLButtonElement> | undefined,
) {
  return (
    <Button
      ref={ref}
      className={twMerge(
        "flex flex-row items-center gap-[1px] px-2 py-2",
        "bg-white border md:w-fit md:border-neutral-200 md:rounded-none",
        "transition-all",
        "[&>svg]:size-3",
        "uppercase text-xs text-neutral-600 font-500",
        "active:scale-90",
        disabled ? "opacity-25" : "hover:z-[1] hover:bg-neutral-200",

        position === "left" ? "md:rounded-l-md" : "",
        position === "right" ? "md:rounded-r-md" : "",
        position === "center" ? "md:rounded-none" : "",
        position === "single" ? "md:rounded-md" : "",

        "border-neutral-200/0",
        "rounded-md w-full justify-between", // button group scenario
        "[&>span>b]:text-es-900",

        // bold
        bold &&
          `md:bg-gradient-to-r md:from-es-100 md:to-es-200 md:border-es-200 md:hover:bg-es-300 
        bg-gradient-to-r from-es-100 to-es-200 border-es-200 hover:bg-es-300
        z-[1]`,

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
