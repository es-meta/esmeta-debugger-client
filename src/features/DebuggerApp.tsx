import React, { useEffect } from "react";

import SpecViewer from "./spec/SpecViewer";
import Toolbar from "./toolbar/Toolbar";
import {
  ConnectedBPViewer,
  ConnectedCallStackViewer,
  ConnectedEnvViewer,
  ConnectedHeapViewer,
} from "./state/StateViewer";
import JSEditor from "./js-editor/JSEditor";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { updateAlgoListRequest } from "@/store/reducers/Spec";
// import ConnectState from "./ConnectState";
import { edit } from "@/store/reducers/JS";
import { run, specContinue } from "@/store/reducers/Debugger";
import {
  addBreak,
  Breakpoint,
  BreakpointType,
} from "@/store/reducers/Breakpoint";
import { useSearchParams } from "react-router";
import { parseStep } from "@/util/convert";
import { toast } from "react-toastify";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  appState: st.appState.state,
  breakpoints: st.breakpoint.items,
  algos: st.spec.nameMap,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateAlgoListRequest: () => dispatch(updateAlgoListRequest()),
  edit: (code: string) => dispatch(edit(code)),
  specContinue: () => dispatch(specContinue()),
  run: () => dispatch(run()),
  addBreak: (bp: Breakpoint) => dispatch(addBreak(bp)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type AppProps = ConnectedProps<typeof connector>;

// App component
const DebuggerApp = ({
  appState,
  algos,
  breakpoints,
  ...methods
}: AppProps) => {
  const [searchParams] = useSearchParams();
  const program = searchParams.get("program");
  const step = searchParams.get("stepId")?.split("/")[1];
  const algoName = searchParams.get("algoName");

  useEffect(() => {
    if (appState !== AppState.INIT) return;
    methods.updateAlgoListRequest();
  }, [appState]);

  useEffect(() => {
    if (Object.keys(algos).length === 0 || !program) return;
    methods.edit(program);
    methods.run();
  }, [algos]);

  useEffect(() => {
    if (appState !== AppState.DEBUG_READY || !step || !algoName) return;

    const stepStrings = step.split(".");
    const steps: number[] = stepStrings.map((stepStr, idx) =>
      parseStep(stepStr, idx),
    );
    const bpName = `${steps} @ ${algoName}`;
    const duplicated = breakpoints.some(
      ({ name }: { name: string }) => name === bpName,
    );

    const valid = algos.hasOwnProperty(algoName);
    if (valid && !duplicated)
      methods.addBreak({
        type: BreakpointType.Spec,
        fid: algos[algoName],
        name: bpName,
        steps: steps,
        enabled: true,
      });
    else if (duplicated) toast.warning(`Breakpoint already set: ${bpName}`);
    else toast.warning(`Wrong algorithm name: ${algoName}`);

    methods.specContinue();
  }, [appState]);

  return (
    <main className="relative px-4 xl:px-20">
      <Toolbar />

      {/* <div
        className="grid
      sm:grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3 gap-4
      "
      > */}
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
      {/* </div> */}
    </main>
  );
};

export default connector(DebuggerApp);

import { layouts } from "./DebuggerApp.layout";

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/styles/DebuggerApp.css";
