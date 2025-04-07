// layouts
import SpecViewer from "@/features/spec/SpecViewer";
import Toolbar from "@/features/toolbar/Toolbar";
import JSEditor from "@/features/js-editor/JSEditor";
// import "react-resizable/css/styles.css";

// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import {
  updateAlgoListRequest,
  updateVersionRequest,
} from "@/store/reducers/Spec";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import StateViewer from "../state/StateViewer";

// App component
export default function DebuggerApp() {
  useDebuggerAppInitializers();

  return (
    <main className="relative xl:px-12 grow flex flex-col overflow-hidden">
      <Toolbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-white dark:bg-black xl:rounded-xl border grow dark:border-neutral-700 border-neutral-300 flex overflow-hidden"
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
    </main>
  );
}

export function useDebuggerAppInitializers() {
  const dispatch = useDispatch();

  const { appState } = useSelector((st: ReduxState) => ({
    appState: st.appState.state,
  }));

  useEffect(() => {
    if (appState !== AppState.INIT) return;
    dispatch(updateAlgoListRequest());
    dispatch(updateVersionRequest());
  }, [appState, dispatch]);
}
