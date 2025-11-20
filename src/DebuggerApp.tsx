import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { JSCodeEditor } from "@/features/js-editor";
import { StateViewer } from "@/features/state";
import { SpecViewer } from "@/features/spec";
import { Toolbar } from "@/features/toolbar";
import { useInitializer } from "./hooks/use-initializer";
import { SuspenseBoundary } from "./components/primitives";

export default function DebuggerApp() {
  useInitializer();

  return (
    <main className="relative grow flex flex-col px-2 xl:px-12 pb-4 transition-[padding] overflow-hidden border-none">
      <Toolbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-white dark:bg-neutral-900 rounded-lg border grow flex overflow-hidden"
      >
        <ResizablePanel minSize={8}>
          <JSCodeEditor />
        </ResizablePanel>
        <ResizableHandle withHandle hitAreaMargins={{ coarse: 16, fine: 8 }} />
        <ResizablePanel minSize={8} className="">
          <SpecViewer />
        </ResizablePanel>
        <ResizableHandle withHandle hitAreaMargins={{ coarse: 16, fine: 8 }} />
        <ResizablePanel minSize={8} collapsible>
          <SuspenseBoundary fatal>
            <StateViewer />
          </SuspenseBoundary>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
