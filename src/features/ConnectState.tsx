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

import { CircleCheckBigIcon, GitBranchIcon, PlugIcon, ServerIcon } from "lucide-react";
import Settings from "./modal/Settings";
import SelectServer from "./input/SelectServer";


function ConnectState(props :ToolbarProps ) {
  return (
    <div className="flex flex-row flex-wrap gap-4 flew-wrap items-center min-h-full lg:px-24 px-4 py-4 justify-between">
      <div>
        ESMeta&nbsp;{'>'}&nbsp;JavaScript&nbsp;Double&nbsp;Debugger&nbsp;
      </div>

      <div className="flex flex-row gap-4 text-xs font-800 text-neutral-500">
      
       
        

        <SelectServer  />
        
          <div className="flex flex-row items-center">
            <PlugIcon />
            localhost:8080
          </div>

          <div className="flex flex-row items-center"> 
            <GitBranchIcon />
            J8AZ1M2
        </div>
        
        {
          props.isInit ?
            <div className="flex flex-row gap-1 items-center text-yellow-500 rounded-lg text-xs uppercase font-800">
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
              Loading…
            </div>
            :
            <div className="flex flex-row gap-1 items-center text-green-500 rounded-lg text-xs font-800">
              <CircleCheckBigIcon size={18} />
              Connected
            </div>
        }

        <Settings />

        </div>
      </div>
  );
}

export default connector(ConnectState);