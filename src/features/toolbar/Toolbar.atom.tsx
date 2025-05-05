import { AppState } from "@/types";
import { ReduxState } from "@/store";

export const selector = (st: ReduxState) => {
  const appState = st.appState.state;
  return {
    disableRun: !(appState === AppState.JS_INPUT),
    disableResume: !(appState === AppState.JS_INPUT), //  TODO && givenConfig.origin.iter !== null,
    disableQuit: appState === AppState.INIT || appState === AppState.JS_INPUT,
    disableGoingForward: !(
      appState === AppState.DEBUG_READY ||
      appState === AppState.DEBUG_READY_AT_FRONT
    ),
    disableGoingBackward: !(
      appState === AppState.DEBUG_READY || appState === AppState.TERMINATED
    ),
    ignoreBP: st.appState.ignoreBP,
  };
};

export type Selected = ReturnType<typeof selector>;
