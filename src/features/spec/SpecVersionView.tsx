import { GitCommitIcon, InfoIcon, TagIcon } from "lucide-react";
import { GitBranchIcon } from "lucide-react";
import { shallowEqual, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import PlainLabel from "@/components/label/PlainLabel";
import { AppState } from "@/store/reducers/AppState";
import { SpecVersion } from "@/store/reducers/Spec";
import { CLIENT_VERSION } from "@/constants/constant";
import { AnimatedDialog } from "@/components/dialog";

export default function SpecVersionView() {
  const { specVersion, isInit, esmetaVersion } = useSelector(
    (state: ReduxState) => ({
      specVersion: state.spec.version.spec,
      isInit: state.appState.state === AppState.INIT,
      esmetaVersion: state.spec.version.esmeta,
    }),
    shallowEqual,
  );

  const versionString = versionStringBuilder(specVersion, isInit);

  return (
    <AnimatedDialog
      title="Versions"
      buttonContent={
        <div
          className="relative inset-0 flex items-center justify-center
      transition-transform active:scale-90 
      flex-row rounded-md text-sm font-medium text-white hover:bg-neutral-500/25 bg-neutral-500/0"
        >
          <PlainLabel>
            <GitBranchIcon />
            <p className="hidden md:block">{versionString}</p>
          </PlainLabel>
        </div>
      }
    >
      <h4 className="mt-4 text-lg font-700">
        ECMA-262 (Specification) Version
      </h4>
      {/* <RadioGroupExample /> */}

      <div className="flex flex-col gap-1">
        <PlainLabel>
          <TagIcon />
          {specVersion.tag || "unknown tag"}
        </PlainLabel>
        <PlainLabel>
          <GitCommitIcon />
          {specVersion.hash || "unknown commit hash"}
        </PlainLabel>
      </div>

      <h4 className="mt-4 text-lg font-700">ESMeta Version</h4>
      <PlainLabel>
        <InfoIcon />
        {esmetaVersion ?? "unknown version"}
      </PlainLabel>
      <h4 className="mt-4 text-lg font-700">ESMeta Debugger Client Version</h4>
      <PlainLabel>
        <InfoIcon />
        {CLIENT_VERSION}
      </PlainLabel>
    </AnimatedDialog>
  );
}

function versionStringBuilder(version: SpecVersion, isInit: boolean) {
  if (isInit) return "loading...";

  if (version.tag) {
    if (version.hash) {
      return `${version.tag} (${version.hash.substring(0, 8)})`;
    } else {
      return version.tag;
    }
  }

  if (version.hash) {
    return version.hash.substring(0, 8);
  } else {
    return "unknown version";
  }
}
