import { lazy } from "react";
import { SettingsIcon } from "lucide-react";
import { AnimatedDialog } from "../animated-dialog";

const SettingsContent = lazy(() => import("./settings.content"));

export default function SettingButton() {
  return (
    <AnimatedDialog
      className="p-6"
      title="Settings"
      buttonContent={
        <div
          className="flex flex-row gap-1 items-center text-lg font-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg active:scale-90 transition-all cursor-pointer p-2"
          title="Share"
        >
          <SettingsIcon className="size-[1em]" />
        </div>
      }
    >
      <SettingsContent />
    </AnimatedDialog>
  );
}
