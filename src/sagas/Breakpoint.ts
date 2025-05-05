import { call, takeLatest, all } from "redux-saga/effects";

import { doAPIPostRequest, doAPIDeleteRequest, doAPIPutRequest } from "@/api";
import {
  addBreak,
  rmBreak,
  serialize,
  toggleBreak,
} from "@/store/reducers/breapoint";

// add breakpoint saga
// TODO add steps
function* addBreakSaga() {
  function* _addBreakSaga(action: ReturnType<typeof addBreak>) {
    if (action.type !== addBreak.type) return;
    yield call(() => doAPIPostRequest("breakpoint", serialize(action.payload)));
  }
  yield takeLatest(addBreak.type, _addBreakSaga);
}

// remove breakpoint saga
function* rmBreakSaga() {
  function* _rmBreakSaga(action: ReturnType<typeof rmBreak>) {
    if (action.type !== rmBreak.type) return;
    yield call(() => doAPIDeleteRequest("breakpoint", action.payload));
  }
  yield takeLatest(rmBreak.type, _rmBreakSaga);
}

// toggle breakpoint saga
function* toggleBreakSaga() {
  function* _toggleBreakSaga(action: ReturnType<typeof toggleBreak>) {
    if (action.type !== toggleBreak.type) return;
    yield call(() => doAPIPutRequest("breakpoint", action.payload));
  }
  yield takeLatest(toggleBreak.type, _toggleBreakSaga);
}

// breakpoint sagas
export default function* breakpointSaga() {
  yield all([addBreakSaga(), rmBreakSaga(), toggleBreakSaga()]);
}
