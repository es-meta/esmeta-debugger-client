import { GlobeIcon, MonitorIcon } from "lucide-react";
import RadioGroupExample from "./RadioGroup";

interface Props {
  selected: Plan;
  setSelected: React.Dispatch<React.SetStateAction<Plan>>;
  saveToLocal: (to: "params") => void;
  url: string;
  setUrl: (url: string) => void;
}

export default function ConnectionSettingsContent({
  selected,
  setSelected,
  saveToLocal,
  url,
  setUrl,
}: Props) {
  return (
    <>
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
        <button className="button-styled" data-dialog-control="close">
          Cancel
        </button>
        <button
          className="button-styled"
          onClick={() => {
            saveToLocal("params");
          }}
        >
          Save for this Tab (Refresh)
        </button>
      </div>
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
