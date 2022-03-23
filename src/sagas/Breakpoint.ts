import { call, takeLatest, all } from "redux-saga/effects";
//
import {
  BreakpointAction,
  BreakpointActionType,
} from "../store/reducers/Breakpoint";
import {
  doAPIPostRequest,
  doAPIDeleteRequest,
  doAPIPutRequest,
} from "../util/api";

// add breakpoint saga
function* addBreakSaga() {
  function* _addBreakSaga(action: BreakpointAction) {
    if (action.type !== BreakpointActionType.ADD_BREAK) return;
    const bp = { name: action.bpName, enabled: true };
    console.log(bp);
    yield call(() => doAPIPostRequest("breakpoint", bp));
  }
  yield takeLatest(BreakpointActionType.ADD_BREAK, _addBreakSaga);
}

// remove breakpoint saga
function* rmBreakSaga() {
  function* _rmBreakSaga(action: BreakpointAction) {
    if (action.type !== BreakpointActionType.RM_BREAK) return;
    yield call(() => doAPIDeleteRequest("breakpoint", action.opt));
  }
  yield takeLatest(BreakpointActionType.RM_BREAK, _rmBreakSaga);
}

// toggle breakpoint saga
function* toggleBreakSaga() {
  function* _toggleBreakSaga(action: BreakpointAction) {
    if (action.type !== BreakpointActionType.TOGGLE_BREAK) return;
    yield call(() => doAPIPutRequest("breakpoint", action.opt));
  }
  yield takeLatest(BreakpointActionType.TOGGLE_BREAK, _toggleBreakSaga);
}

// breakpoint sagas
export default function* breakpointSaga() {
  yield all([addBreakSaga(), rmBreakSaga(), toggleBreakSaga()]);
}
