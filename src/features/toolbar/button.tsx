import { ReactElement, type ReactNode, type Ref } from "react";
import { Button } from "@headlessui/react";
import { cn } from "@/utils";

interface Props {
  position?: "left" | "right" | "center" | "single";
  disabled?: boolean;
  icon: ReactElement<SVGElement>;
  label: ReactNode;
  onClick?: () => void;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

export default function ToolbarButton({
  ref,
  icon,
  label,
  disabled,
  onClick,
  position = "single",
  className = "",
  ...rest
}: Props) {
  return (
    <Button
      ref={ref}
      className={cn(
        "inline-flex flex-row items-center gap-[2px] px-2 py-1",
        "bg-white dark:bg-neutral-950 border",
        "transition-all",
        "[&>svg]:block [&>svg]:size-[12px] md:[&>svg]:block",
        "uppercase text-xs text-neutral-700 dark:text-neutral-300 font-600",
        "disabled:active:text-red-500 disabled:active:border-red-500",
        "enabled:active:scale-95",
        "disabled:opacity-25 disabled:cursor-not-allowed",
        "enabled:hover:bg-neutral-300 enabled:dark:hover:bg-neutral-700 enabled:cursor-pointer",
        "data-[position=left]:rounded-l-md",
        "data-[position=right]:rounded-r-md",
        "data-[position=center]:rounded-none",
        "data-[position=single]:rounded-md",
        "[&>span>b]:text-es-600",
        className,
      )}
      data-position={position}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon}
      {label}
    </Button>
  );
}
