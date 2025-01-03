import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { GitCommitIcon, GitCommitVerticalIcon, InfoIcon, SettingsIcon, TagIcon } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { GitBranchIcon, PlugIcon } from "lucide-react";

import { useSelector } from "react-redux";
import { ReduxState } from "@/store";
import PlainLabel from "@/components/label/PlainLabel";
import { AppState } from "@/store/reducers/AppState";
import { SpecVersion } from "@/store/reducers/Spec";
import { CLIENT_VERSION } from "@/constants/constant";

export default function SpecVersionView() {
  let [isOpen, setIsOpen] = useState(false);

  const { version, isInit } = useSelector(
    (state: ReduxState) => ({
      version: state.spec.version,
      isInit: state.appState.state === AppState.INIT,
    })
  );

  const versionString = versionStringBuilder(version, isInit);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div
        className="group relative inset-0 flex items-center justify-center
      transition-transform active:scale-90
      "
      >
        <button
          type="button"
          onClick={openModal}
          className="flex flex-row rounded-md text-sm font-medium text-white transition-all items-center justify-between hover:bg-neutral-500/25 bg-neutral-500/0 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-300/75"
        >
          <div className="h-8 flex flex-row"></div>

          <PlainLabel>
            <GitBranchIcon />
            {versionString}
          </PlainLabel>

        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-3">
                  <DialogTitle as="h3" className="text-xl font-700 leading-6 text-gray-900">
                    Versions
                  </DialogTitle>

                  <h4 className="mt-4 text-lg font-700">ECMA-262 (Specification) Version</h4>
                  {/* <RadioGroupExample /> */}

                  
                  <div className="flex flex-col gap-1">
                  <PlainLabel>
                    <TagIcon />
                    {version.tag || 'unknown tag'}
                  </PlainLabel>
                  <PlainLabel>
                    <GitCommitIcon />
                    {version.hash || 'unknown commit hash'}
                    </PlainLabel>
                  </div>

                  <h4 className="mt-4 text-lg font-700">ESMeta Version</h4>
                  <PlainLabel>
                    <InfoIcon />
                    to be implemented
                  </PlainLabel>
                  <h4 className="mt-4 text-lg font-700">ESMeta Debugger Client Version</h4>
                  <PlainLabel>
                    <InfoIcon />
                    {CLIENT_VERSION}
                  </PlainLabel>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
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