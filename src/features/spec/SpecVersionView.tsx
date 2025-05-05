import { lazy } from "react";
import { AnimatedDialog } from "@/components/animated-dialog";
import { SuspenseBoundary } from "@/components/suspense-boundary";

import {
  CircleAlertIcon,
  GitCommitHorizontalIcon,
  LoaderCircleIcon,
  TagIcon,
} from "lucide-react";
import { useAtomValue, atoms } from "@/atoms";

const CLASSNAME = `relative inset-0 justify-center
  font-medium hover:bg-neutral-500/25 bg-neutral-500/0 font-mono
  flex flex-row gap-1 items-center text-lg font-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg active:scale-90 transition-all cursor-pointer p-2
  `;

const SpecVersionViewContent = lazy(() => import("./SpecVersionView.content"));

export default function SpecVersionView() {
  return (
    <AnimatedDialog
      className="p-6"
      title="Versions"
      buttonContent={<SpecVersionViewButton />}
    >
      <SpecVersionViewContent />
    </AnimatedDialog>
  );
}

function SpecVersionViewButton() {
  return (
    <div className={CLASSNAME}>
      <SuspenseBoundary
        intentional
        error={
          <>
            <CircleAlertIcon className="size-[1em]" />
            <span className="hidden md:block uppercase text-xs font-700">
              unknwn
            </span>
          </>
        }
        loading={
          <>
            <LoaderCircleIcon className="animate-spin size-[1em]" />
            <span className="hidden md:block uppercase text-xs font-700">
              {fix6("")}
            </span>
          </>
        }
      >
        <VersionShortAsync />
      </SuspenseBoundary>
    </div>
  );
}

function VersionShortAsync() {
  const { spec: version } = useAtomValue(atoms.stats.versionAtom);

  if (version.tag) {
    return (
      <>
        <TagIcon className="size-[1em]" />
        <span className="hidden md:block uppercase text-xs font-700">
          {fix6(version.tag)}
        </span>
      </>
    );
  }

  if (version.hash) {
    return (
      <>
        <GitCommitHorizontalIcon className="size-[1em]" />
        <span className="hidden md:block uppercase text-xs font-700">
          {fix6(version.hash)}
        </span>
      </>
    );
  } else {
    throw new Error("No version info available");
  }
}

function fix6(str: string) {
  return str.substring(0, 6).padEnd(6, "\u00A0");
}
