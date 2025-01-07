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

// App component
export default function DebuggerApp() {
  useDebuggerAppInitializers();

  return (
    <main className="relative px-4 xl:px-20 h-full grow flex flex-col">
      <Toolbar />

      {/* <div className="grid lg:grid-cols-3"> */}
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-white rounded-xl min-h-full border grow border-neutral-300"
      >
        <ResizablePanel minSize={24}>
          <JSEditor />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={24}>
          <SpecViewer />
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
