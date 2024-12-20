import { connect, ConnectedProps } from "react-redux";
import { ReduxState, Dispatch } from "@/store";

import { AppState, ConnectionState } from "@/store/reducers/AppState";
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

import { CircleAlertIcon, CircleCheckBigIcon, GitBranchIcon, LoaderPinwheelIcon, PlugIcon, ServerIcon } from "lucide-react";
import Settings from "./modal/Settings";
import ToolButtonPlain from "./toolbar/ToolButtonPlain";

function ConnectState(props :ToolbarProps ) {
  return (

      <div className="flex flex-row gap-1 text-xs font-800 text-neutral-500 *:border-neutral-50/0  *:p-1 *:rounded-lg *:transition-all">
      
       <ToolButtonPlain>
          <PlugIcon />
          localhost:8080
        </ToolButtonPlain>

      <ToolButtonPlain>
          <GitBranchIcon />
          J8AZ1M2
      </ToolButtonPlain>
        
      <ToolButtonPlain>{
        <>
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
              Initializing...
            </div>
            
            <div className="flex flex-row gap-1 items-center text-green-500 rounded-lg text-xs font-800">
              <CircleCheckBigIcon size={18}  />
              Connected
          </div>


          <div className="flex flex-row gap-1 items-center text-red-500 rounded-lg text-xs font-800">
              <CircleAlertIcon size={18}  />
              Not Connected
          </div>


          {props.busy && <div className="flex flex-row gap-1 items-center text-blue-500 rounded-lg text-xs font-800">
              <LoaderPinwheelIcon size={18} className="animate-spin" />
              Busy
          </div>}

          {props.busyCount}

          
          </>
        }</ToolButtonPlain>

      <ToolButtonPlain>
        <Settings />
    </ToolButtonPlain>

      </div>
  );
}

export default connector(ConnectState);