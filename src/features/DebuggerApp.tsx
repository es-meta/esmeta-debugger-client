import React, { useEffect } from "react";

import SpecViewer from "./SpecViewer";
import Toolbar from "./toolbar/Toolbar";
import StateViewer from "./StateViewer";
import JSEditor from "./JSEditor";

import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";
import { AppState } from "@/store/reducers/AppState";
import { updateAlgoListRequest } from "@/store/reducers/Spec";
import ConnectState from "./ConnectState";
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
    <div className="px-20">
      <ConnectState />
      <Toolbar />

      <div className="grid grid-cols-3 gap-10">
        <JSEditor />
        <SpecViewer />
        <StateViewer />
      </div>
    </div>
  );
};

export default connector(DebuggerApp);
