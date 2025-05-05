import { all } from "redux-saga/effects";

import breakpointSaga from "./breakpoint";
import debuggerSaga from "./debugger";
import irSaga from "./ir";

export default function* rootSaga() {
  yield all([breakpointSaga(), debuggerSaga(), irSaga()]);
}
