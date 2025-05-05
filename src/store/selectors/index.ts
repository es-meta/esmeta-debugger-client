import { AppState } from "@/types";
import type { ReduxState } from "..";

export const busyStateSelector = (st: ReduxState) => {
  const x = st.appState.busy;
  const isInit = st.appState.state === AppState.INIT;

  if (x === null) return "init";

  if (x === 0) {
    return "connected";
  }

  if (x > 0) {
    return isInit ? "init" : "busy";
  }

  return "not_connected";
};
