import { lazy, useState } from "react";
import { AnimatedDialog } from "@/components/dialog/animated-dialog";
import { CircleHelpIcon } from "lucide-react";

const WelcomeContent = lazy(() => import("./Welcome.content"));

export default function WelcomeModal() {
  const [idx, setIdx] = useState(0);

  return (
    <AnimatedDialog
      onPreload={() => import("./Welcome.content")}
      onClose={() => setIdx(0)}
      buttonContent={
        <div
          className="flex flex-row gap-1 items-center text-lg font-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg active:scale-90 transition-all cursor-pointer p-2"
          title="Show Brief Introduction"
        >
          <CircleHelpIcon className="size-[1em]" />
        </div>
      }
    >
      <WelcomeContent idx={idx} setIdx={setIdx} />
    </AnimatedDialog>
  );
}
