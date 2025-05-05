import { cn } from "@/utils";
import { atoms, useAtomValue } from "@/atoms";

import { GitCommitIcon, InfoIcon, TagIcon } from "lucide-react";

const CLASSNAME = cn(
  "flex flex-row items-center gap-[2px] px-1 py-1",
  "transition-all",
  "[&>svg]:size-4",
  "uppercase text-sm",
);

export default function SpecVersionViewContent() {
  const { spec, esmeta, client } = useAtomValue(atoms.stats.versionAtom);

  return (
    <>
      <h4 className="mt-4 text-lg font-700">
        ECMA-262 (Specification) Version
      </h4>

      <div className="flex flex-col gap-1">
        <div className={CLASSNAME}>
          <TagIcon />
          {spec.tag || "unknown tag"}
        </div>
        <div className={CLASSNAME}>
          <GitCommitIcon />
          {spec.hash || "unknown commit hash"}
        </div>
      </div>

      <h4 className="mt-4 text-lg font-700">ESMeta Version</h4>
      <div className={CLASSNAME}>
        <InfoIcon />
        {esmeta ?? "unknown version"}
      </div>
      <h4 className="mt-4 text-lg font-700">ESMeta Debugger Client Version</h4>
      <div className={CLASSNAME}>
        <InfoIcon />
        {client}
      </div>
    </>
  );
}
