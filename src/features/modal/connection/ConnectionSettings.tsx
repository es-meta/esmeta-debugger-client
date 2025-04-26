import { useCallback, useState } from "react";
import { GlobeIcon, MonitorIcon } from "lucide-react";
import RadioGroupExample from "./RadioGroup";
import ConnectStateViewer from "@/features/modal/connection/ConnectStateViewer";
import { useAtomValue, useSetAtom } from "jotai";
import { givenConfigAtom, setApiAtom } from "@/atoms/defs/config";
import { AnimatedDialog } from "@/components/dialog";

export default function ConnectionSettings() {
  const givenConfig = useAtomValue(givenConfigAtom);
  const givenApi = givenConfig.api;
  const setApi = useSetAtom(setApiAtom);

  const [selected, setSelected] = useState<Plan>(
    givenApi.type === "browser" ? plans[1] : plans[0],
  );
  const [url, setUrl] = useState(givenApi.type === "http" ? givenApi.url : "");

  const resetOnClose = useCallback(() => {
    setTimeout(
      () => setSelected(givenApi.type === "browser" ? plans[1] : plans[0]),
      0,
    );
  }, []);

  const saveToLocal = useCallback(
    (to: "params") => {
      const set = selected.id === "browser" ? "browser" : url;
      switch (to) {
        case "params":
          setApi(set);
          break;
      }
    },
    [selected.id, url],
  );

  return (
    <AnimatedDialog
      onClose={resetOnClose}
      buttonContent={
        <div
          className="group relative inset-0 flex items-center justify-center
      transition-transform active:scale-90
      flex-row rounded-md text-sm font-medium text-white hover:bg-neutral-500/25 bg-neutral-500/0
      "
        >
          <ConnectStateViewer />
        </div>
      }
    >
      <h4 className="mt-4 text-lg font-700">Connection Mode</h4>
      <RadioGroupExample
        selected={selected}
        setSelected={setSelected}
        options={plans}
        getId={p => p.id}
        getIcon={p => p.icon}
        getLabel={p => p.name}
        getDescription={p => p.description}
      />
      <h4 className="mt-4 text-lg font-700">API Address</h4>
      <input
        type="text"
        placeholder="http://localhost:8080"
        disabled={selected.id === "browser"}
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <div className="flex justify-end mt-4 gap-2">
        <button
          className="h-8 px-3 text-xs rounded-lg bg-es-500/30 font-500 hover:bg-es-500/70 active:scale-95 transition-all"
          data-dialog-control="close"
        >
          Cancel
        </button>
        <button
          className="h-8 px-3 text-xs rounded-lg bg-es-500/30 font-500 hover:bg-es-500/70 active:scale-95 transition-all"
          onClick={() => {
            saveToLocal("params");
          }}
        >
          Save for this Tab (Refresh)
        </button>
      </div>
    </AnimatedDialog>
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
