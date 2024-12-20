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

export default function ToolButtonPlain({children, disabled, onClick, position = "single"} : Props) {
  return (
    <Button className={
      twJoin(
        "flex flex-row items-center gap-[2px] px-3 py-2",
        "bg-neutral-300 border bg-opacity-0 border-neutral-200",
        "transition-all",
        "[&>svg]:size-3",
        "uppercase text-xs font-500",
        "cursor-default",
        disabled ? "opacity-25" : "hover:z-[1] hover:bg-opacity-100",

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