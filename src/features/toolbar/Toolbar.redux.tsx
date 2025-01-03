import { GIVEN_SETTINGS } from "@/constants/settings";
import type { ReduxState } from "@/store";
import { AppState } from "@/store/reducers/AppState";

export const selector = (st: ReduxState) => ({
  disableRun: !(st.appState.state === AppState.JS_INPUT),
  disableResume: !(st.appState.state === AppState.JS_INPUT) && GIVEN_SETTINGS.origin.iter !== null,
  disableQuit:
    st.appState.state === AppState.INIT ||
    st.appState.state === AppState.JS_INPUT,
  disableGoingForward: !(
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.DEBUG_READY_AT_FRONT
  ),
  disableGoingBackward: !(
    st.appState.state === AppState.DEBUG_READY ||
    st.appState.state === AppState.TERMINATED
  ),
});

export type Selected = ReturnType<typeof selector>;
