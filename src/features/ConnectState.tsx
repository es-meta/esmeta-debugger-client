import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";

import { AppState } from "@/store/reducers/AppState";
import {
  run,
  stop,
  specStep,
  specStepOut,
  specStepOver,
  jsStep,
  jsStepOut,
  jsStepOver,
  specContinue,
} from "@/store/reducers/Debugger";

// connect redux store
const mapStateToProps = (st: ReduxState) => ({
  isInit: st.appState.state === AppState.INIT,
  disableRun: st.appState.state !== AppState.JS_INPUT,
  disableDebuggerBtn: st.appState.state !== AppState.DEBUG_READY,
  busy: st.appState.busy > 0,
  busyCount: st.appState.busy,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  run: () => dispatch(run()),
  stop: () => dispatch(stop()),
  specStep: () => dispatch(specStep()),
  specStepOut: () => dispatch(specStepOut()),
  specStepOver: () => dispatch(specStepOver()),
  jsStep: () => dispatch(jsStep()),
  jsStepOut: () => dispatch(jsStepOut()),
  jsStepOver: () => dispatch(jsStepOver()),
  specContinue: () => dispatch(specContinue()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type ToolbarProps = ConnectedProps<typeof connector>;

import { GitBranchIcon, PlugIcon } from "lucide-react";
import Settings from "./modal/Settings";
import ToolButtonPlain from "./toolbar/ToolButtonPlain";
import ConnectStateViewer from "@/components/custom/ConnectStateViewer";

function ConnectState(props: ToolbarProps) {
  return (
    <div
      className="
      flex flex-row gap-1 text-xs font-800 text-neutral-500 *:border-neutral-50/0  *:p-1 *:rounded-lg *:transition-all
      "
    >
      <ToolButtonPlain>
        <PlugIcon />
        localhost:8080
      </ToolButtonPlain>

      <ToolButtonPlain>
        <GitBranchIcon />
        J8AZ1M2
      </ToolButtonPlain>

      <Settings />
    </div>
  );
}

export default connector(ConnectState);
