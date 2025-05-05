// import "react-resizable/css/styles.css";

// hooks
import { useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import JSEditor from "@/features/js-editor/JSEditor";
import StateViewer from "@/features/state/StateViewer";
import SpecViewer from "@/features/spec/SpecViewer";
import Toolbar from "@/features/toolbar/Toolbar";
import { IS_DEBUG } from "@/constants";
import { toast } from "react-toastify";
import { SuspenseBoundary } from "@/components/suspense-boundary";
import { atoms, jotaiStore } from "@/atoms";
import { useAppDispatch } from "@/hooks";
import { move } from "@/store/reducers/app-state";
import { AppState } from "@/types";

export default function DebuggerApp() {
  return (
    <main className="relative grow flex flex-col px-2 xl:px-12 pb-2 transition-[padding] overflow-hidden border-none">
      <Toolbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-white dark:bg-neutral-900 rounded-lg border grow flex overflow-hidden"
      >
        <ResizablePanel minSize={8}>
          <JSEditor />
        </ResizablePanel>
        <ResizableHandle withHandle hitAreaMargins={{ coarse: 16, fine: 8 }} />
        <ResizablePanel minSize={8} className="">
          <SpecViewer />
        </ResizablePanel>
        <ResizableHandle withHandle hitAreaMargins={{ coarse: 16, fine: 8 }} />
        <ResizablePanel minSize={8} collapsible>
          <StateViewer />
        </ResizablePanel>
      </ResizablePanelGroup>
      <SuspenseBoundary unexpected error={null} loading={null}>
        <MountDebuggerAppInitializers />
      </SuspenseBoundary>
    </main>
  );
}

export function MountDebuggerAppInitializers() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (IS_DEBUG)
      toast.warn(
        <p>
          This app is running in development mode. Please use{" "}
          <code>npm start</code> instead.
        </p>,
      );
  }, []);

  useEffect(() => {
    Promise.all([
      jotaiStore.get(atoms.spec.irToSpecNameMapAtom),
      jotaiStore.get(atoms.spec.nameMapAtom),
    ]).then(() => dispatch(move(AppState.JS_INPUT)));
  }, []);

  return null;
}
