import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { CpuIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { AppState } from "@/types";
import StateViewerSelect from "./StateViewerSelect";
import { ViewerItem, viewerItems } from "./vieweritems";
import { useAtom } from "jotai";
import { atoms } from "@/atoms";
import { useAppSelector } from "@/hooks";

export default function StateViewer() {
  const [collapsed, setCollapsed] = useState(false);
  const appState = useAppSelector(st => st.appState.state);
  const disabled = !(
    appState === AppState.DEBUG_READY_AT_FRONT ||
    appState === AppState.DEBUG_READY ||
    appState === AppState.TERMINATED
  );
  const [targetId, setActiveView] = useAtom(
    atoms.client.clientActiveViewerAtom,
  );

  const toggle = <div onClick={() => setCollapsed(!collapsed)}>toggle</div>;

  return collapsed ? (
    toggle
  ) : (
    <Card className="flex flex-col size-full">
      <CardHeader
        title="State&nbsp;Viewer"
        icon={<CpuIcon size={14} className="inline" />}
      >
        <StateViewerSelect
          selected={viewerItems.find(s => s.id === targetId) || viewerItems[0]}
          options={viewerItems}
          setSelected={(s: ViewerItem) => {
            if (!s) return;
            setActiveView(s.id);
          }}
          getId={s => s.name}
          getIcon={s => s.icon}
          getLabel={s => s.name}
        />
      </CardHeader>
      <div className="overflow-y-scroll size-full">
        {disabled ? (
          <p className="text-neutral-500 dark:text-neutral-400 p-2">
            Disabled. Start debugger to use.
          </p>
        ) : (
          // temp fix to preserve state in render tree - use redux later
          viewerItems.map(s => (
            <div key={s.name} className={targetId === s.id ? "" : "hidden"}>
              <Suspense fallback={null}>
                <s.view />
              </Suspense>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
