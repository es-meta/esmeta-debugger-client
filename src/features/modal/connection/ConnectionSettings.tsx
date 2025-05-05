import { lazy, useCallback, useState } from "react";
import { GlobeIcon, MonitorIcon } from "lucide-react";
import ConnectStateViewer from "@/features/modal/connection/ConnectStateViewer";
import { useAtomValue, useSetAtom } from "jotai";
import { givenConfigAtom, setApiAtom } from "@/atoms/defs/config";
import { AnimatedDialog } from "@/components/animated-dialog";

const ConnectionSettingsContent = lazy(
  () => import("./ConnectionSettings.content"),
);

export default function ConnectionSettings() {
  const givenConfig = useAtomValue(givenConfigAtom);
  const givenApi = givenConfig.api;
  const setApi = useSetAtom(setApiAtom);

  const [selected, setSelected] = useState<Plan>(
    givenApi.type === "browser" ? plans[1] : plans[0],
  );
  const [url, setUrl] = useState(givenApi.type === "http" ? givenApi.url : "");

  const resetOnClose = useCallback(() => {
    setSelected(givenApi.type === "browser" ? plans[1] : plans[0]);
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
      className="p-6"
      title="ESMeta Connection Settings"
      onClose={resetOnClose}
      buttonContent={
        <div
          className="group relative inset-0 flex items-center justify-center
      transition-transform active:scale-90
      flex-row rounded-md text-sm font-medium text-white hover:bg-neutral-500/25 bg-neutral-500/0
      "
        >
          <ConnectStateViewer adaptive />
        </div>
      }
    >
      <ConnectionSettingsContent
        selected={selected}
        setSelected={setSelected}
        saveToLocal={saveToLocal}
        url={url}
        setUrl={setUrl}
      />
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
