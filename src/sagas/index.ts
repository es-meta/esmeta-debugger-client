import { all } from "redux-saga/effects";

import debuggerSaga from "./Debugger";
import breakpointSaga from "./Breakpoint";
import irStateSaga from "./IrState";
import specSaga from "./Spec";

export default function* rootSaga() {
  yield all([debuggerSaga(), breakpointSaga(), irStateSaga(), specSaga()]);
}
