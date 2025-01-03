// layouts
import SpecViewer from "@/features/spec/SpecViewer";
import Toolbar from "@/features/toolbar/Toolbar";
import {
  ConnectedBPViewer,
  ConnectedCallStackViewer,
  ConnectedEnvViewer,
  ConnectedHeapViewer,
} from "@/features/state/StateViewer";
import JSEditor from "@/features/js-editor/JSEditor";
import { layouts } from "./DebuggerApp.layout";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

// NOTE don't edit import order below
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/styles/DebuggerApp.css";

// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { updateAlgoListRequest, updateVersionRequest } from "@/store/reducers/Spec";

// App component
export default function DebuggerApp() {
  useDebuggerAppInitializers();

  return (
    <main className="relative px-4 xl:px-20">
      <Toolbar />
      <ResponsiveGridLayout
        className="flex layout rounded-sm"
        layouts={layouts}
        // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
        draggableHandle=".drag-handle"
      >
        <div key="specv" className="relative">
          <SpecViewer />
        </div>
        <div key="calls" className="relative">
          <ConnectedCallStackViewer />
        </div>
        <div key="envir" className="relative">
          <ConnectedEnvViewer />
        </div>
        <div key="heapv" className="relative">
          <ConnectedHeapViewer />
        </div>
        <div key="break" className="relative">
          <ConnectedBPViewer />
        </div>
        <div key="jsedi" className="relative">
          <JSEditor />
        </div>
      </ResponsiveGridLayout>
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
