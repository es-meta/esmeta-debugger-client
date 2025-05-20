import Card from "@/components/layout/Card";
import CardHeader from "@/components/layout/CardHeader";
import { Layers3Icon, LoaderIcon } from "lucide-react";
import { Suspense } from "react";
import { AppState } from "@/types";
import StateViewerSelect from "./StateViewerSelect";
import { ViewerItem, viewerItems } from "./vieweritems";
import { useAtom, useAtomValue } from "jotai";
import { atoms } from "@/atoms";

export function StateViewer() {
  const appState = useAtomValue(atoms.app.appState);

  const disabled = !(
    appState === AppState.DEBUG_READY_AT_FRONT ||
    appState === AppState.DEBUG_READY ||
    appState === AppState.TERMINATED
  );

  const [targetId, setActiveView] = useAtom(
    atoms.client.clientActiveViewerAtom,
  );

  return (
    <Card className="flex flex-col size-full">
      <CardHeader
        title="State&nbsp;Viewer"
        icon={<Layers3Icon size={14} className="inline" />}
      >
        <div className="absolute right-2">
          <StateViewerSelect
            selected={
              viewerItems.find(s => s.id === targetId) || viewerItems[0]
            }
            options={viewerItems}
            setSelected={(s: ViewerItem) => {
              if (!s) return;
              setActiveView(s.id);
            }}
            getId={s => s.name}
            getIcon={s => s.icon}
            getLabel={s => s.name}
          />
        </div>
      </CardHeader>
      <div className="overflow-y-scroll size-full">
        {disabled ? (
          <aside className="text-center py-4">
            Disabled. Start debugger to use.
          </aside>
        ) : (
          viewerItems
            .filter(({ id }) => id === targetId)
            .map(s => (
              <Suspense
                key={s.name}
                fallback={
                  <div className="size-full flex items-center justify-center">
                    <LoaderIcon className="animate-spin" />
                  </div>
                }
              >
                <s.view />
              </Suspense>
            ))
        )}
      </div>
    </Card>
  );
}
