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
  disableRun: st.appState.state !== AppState.JS_INPUT,
  disableDebuggerBtn: st.appState.state !== AppState.DEBUG_READY,
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

import { CircleCheckBigIcon, ServerIcon } from "lucide-react";


function ConnectState(props :ToolbarProps ) {
  return (
    <div className="flex flex-row flex-wrap gap-4 flew-wrap items-center min-h-full lg:px-24 px-4 py-4 justify-between">
      <div>
        ESMeta&nbsp;{'>'}&nbsp;JavaScript&nbsp;Double&nbsp;Debugger&nbsp;
      </div>

      <div className="flex flex-row  flex-wrap items-center">
        <ServerIcon />
        {
          props.disableDebuggerBtn && props.disableRun ?

            <div className="flex flex-row gap-1 items-center bg-yellow-500 text-white px-4 py-2 rounded-lg text-xs uppercase font-800">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={("animate-spin")}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </span>
              Loading ESMeta…
            </div>
            :
            <div className="flex flex-row gap-1 items-center text-green-500 px-4 py-2 rounded-lg text-xs uppercase font-800">
              <CircleCheckBigIcon size={18} />
              ESMeta Connected
            </div>
        }
      

        <span>
          Source: localhost:8080
          Version: ES2024
        </span>
      </div>
    </div>
  );
}

export default connector(ConnectState);