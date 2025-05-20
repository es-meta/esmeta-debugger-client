import { Loader2Icon } from "lucide-react";
import { twJoin } from "tailwind-merge";

export function Loading() {
  return (
    <div
      className={twJoin(
        "absolute",
        "top-1/2 left-1/2",
        "-translate-x-1/2",
        "-translate-y-1/2",
      )}
    >
      <Loader2Icon className="animate-spin text-black z-50" />
    </div>
  );
}
