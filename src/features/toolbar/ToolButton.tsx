'use client';

import type { ReactNode } from "react";
import { Button } from "@headlessui/react";
import { twJoin } from "tailwind-merge";

interface Props {
  position?: "left" | "right" | "center" | "single";
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

function ToolButton({children, disabled, onClick, position = "single"} : Props) {
  return (
    <Button className={
      twJoin(
        "flex flex-row items-center gap-1 px-3 py-2",
        "bg-white border border-neutral-200",
        "transition-all",
        "[&>svg]:size-4",
        "uppercase text-sm font-500",
        disabled ? "opacity-25" : "hover:z-[1] hover:bg-neutral-200",

        position === "left" ? "rounded-l-md" : "",
        position === "right" ? "rounded-r-md" : "",
        position === "center" ? "rounded-none" : "",
        position === "single" ? "rounded-md" : "",
      )
    } disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  )
}

export default ToolButton;