import StateViewerItem from "./StateViewerItem";

import CallStackViewer from "./callstack/CallStackViewer";
import HeapViewer from "./heap/HeapViewer";
import Breakpoints from "./breakpoint/Breakpoints";
import SpecEnvViewer from "./env/SpecEnvViewer";
import { AppState } from "@/store/reducers/AppState";
import { ReduxState } from "@/store";
import { useSelector } from "react-redux";

const selector = (st: ReduxState) => ({
  disableStateViewer: !(
    st.appState.state === AppState.DEBUG_READY_AT_FRONT ||
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
});

export function ConnectedCallStackViewer() {
  const { disableStateViewer } = useSelector(selector);

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Call Stack"
      body={<CallStackViewer />}
    />
  );
}

export function ConnectedEnvViewer() {
  const { disableStateViewer } = useSelector(selector);

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Environment"
      body={<SpecEnvViewer />}
    />
  );
}

export function ConnectedHeapViewer() {
  const { disableStateViewer } = useSelector(selector);

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Heap"
      body={<HeapViewer />}
    />
  );
}

export function ConnectedBPViewer() {
  const { disableStateViewer } = useSelector(selector);

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Breakpoints"
      body={<Breakpoints />}
    />
  );
}
