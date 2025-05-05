import { lazy } from "react";
import { ShareIcon } from "lucide-react";
import { AnimatedDialog } from "../animated-dialog";

const ShareContent = lazy(() => import("./share-button.content"));

export default function ShareButton() {
  return (
    <AnimatedDialog
      className="p-6"
      title="Share"
      buttonContent={
        <div
          className="flex flex-row gap-1 items-center text-lg font-500 hover:bg-neutral-100 hover:dark:bg-neutral-800 rounded-lg active:scale-90 transition-all cursor-pointer p-2"
          title="Share"
        >
          <ShareIcon className="size-[1em]" />
        </div>
      }
    >
      <ShareContent />
    </AnimatedDialog>
  );
}
