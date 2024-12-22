import StateViewerItem from "./StateViewerItem";
import { connector, type StateViewerProps } from "./StateViewer.redux";

import CallStackViewer from "./callstack/CallStackViewer";
import HeapViewer from "./heap/HeapViewer";
import Breakpoints from "./breakpoint/Breakpoints";
import SpecEnvViewer from "./env/SpecEnvViewer";

export const ConnectedCallStackViewer = connector(function StateViewer(
  props: StateViewerProps,
) {
  const { disableStateViewer } = props;

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Call Stack"
      body={<CallStackViewer />}
    />
  );
});

export const ConnectedEnvViewer = connector(function StateViewer(
  props: StateViewerProps,
) {
  const { disableStateViewer } = props;

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Environment"
      body={<SpecEnvViewer />}
    />
  );
});

export const ConnectedHeapViewer = connector(function StateViewer(
  props: StateViewerProps,
) {
  const { disableStateViewer } = props;

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Heap"
      body={<HeapViewer />}
    />
  );
});

export const ConnectedBPViewer = connector(function StateViewer(
  props: StateViewerProps,
) {
  const { disableStateViewer } = props;

  return (
    <StateViewerItem
      disabled={disableStateViewer}
      header="Specification Breakpoints"
      body={<Breakpoints />}
    />
  );
});
