import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { GlobeIcon, MonitorIcon, PlugIcon } from "lucide-react";

import PlainLabel from "../../components/label/PlainLabel";
import SettingPanel from "./SettingPanel";
import RadioGroupExample from "./settings/RadioGroup";
import SaveButton, { opts } from "./settings/SaveButton";
import { GIVEN_SETTINGS, QUERY_API } from "@/constants/settings";
import { buildSearchParams, getNewLocationWithQuery, getSearchQuery, setLocalStorage } from "@/util/query.util";

export default function Settings() {
  let [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] = useState<Plan>(GIVEN_SETTINGS.api.type === "browser" ? plans[1] : plans[0]);
  const [url, setUrl] = useState(GIVEN_SETTINGS.api.type === "http" ? GIVEN_SETTINGS.api.url : "");
  const [saveOption, setSaveOption] = useState(opts[0]);

  const closeModalWithReset = useCallback(() => {
    setIsOpen(false);
    const to = setTimeout(() => setSelected(GIVEN_SETTINGS.api.type === "browser" ? plans[1] : plans[0]), 0);
    return () => clearTimeout(to);
  }, []);

  const saveToLocal = useCallback((to: 'params' | 'storage') => {
    const set = selected.id === "browser" ? "browser" : url;
    switch (to) {
      case 'params':
        window.location.search = buildSearchParams(QUERY_API, set);
        break;
      case 'storage':
        setLocalStorage(QUERY_API, set);
        window.location.reload();
        break;
    }
  }, [selected.id, url]);

  function openModal() {
    setIsOpen(true);
  }

  const API = GIVEN_SETTINGS.api;

  
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
            {API.type === "http" ? <>
              <PlugIcon />
              {API.url}  
            </> : <>
              <GlobeIcon />
              Browser
              </>}
          </PlainLabel>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalWithReset}>
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-4">
                <DialogTitle as="h3" className="text-xl font-700 leading-6 text-gray-900">
                    ESMeta Debugger Settings
                    </DialogTitle>

                    <h4 className="mt-4 text-lg font-700">Connection Mode</h4>
                    <RadioGroupExample selected={selected} setSelected={setSelected}
                    options={plans} getId={p => p.id} getIcon={p => p.icon} getLabel={p => p.name} getDescription={p => p.description} />
                    <h4 className="mt-4 text-lg font-700">API Address</h4>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md w-full p-2"
                      placeholder="http://localhost:8080"
                      disabled={selected.id === "browser"}
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />

                  <div className="flex justify-end mt-4 gap-2">
                      <button className="h-8 px-3 text-xs rounded-lg bg-es-100 font-500 hover:bg-es-200 active:scale-95 transition-all">
                        Cancel
                      </button>
                      <SaveButton value={saveOption} setValue={setSaveOption} save={saveToLocal} />
                    </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}


interface Plan {
  id: string;
  name: string;
  description: React.ReactElement<HTMLParagraphElement>;
  icon: React.ReactElement;
}

const plans: Plan[] = [
  {
    id: "http",
    name: "Connect to ESMeta API Server",
    description: (
      <p className="inline">
        Install ESMeta and run{" "}
        <code className="inline rounded">esmeta web</code>
      </p>
    ),
    icon: <MonitorIcon />,
  },
  {
    id: "browser",
    name: "Run ESMeta on Web Browser",
    description: <p className="inline">No configuration needed.</p>,
    icon: <GlobeIcon />,
  },
];