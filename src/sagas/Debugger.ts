import { call, put, select, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

import { ReduxState } from "../store";
import { AppState, move } from "../store/reducers/AppState";
import { DebuggerActionType } from "../store/reducers/Debugger";
import { serialize } from "../store/reducers/Breakpoint";
import {
  clearIrState,
  updateHeapRequest,
  updateCallStackRequest,
} from "../store/reducers/IrState";
import { clearJS } from "../store/reducers/JS";
import { clearAlgo } from "../store/reducers/Spec";
import { doAPIPostRequest } from "../util/api";

// run debugger saga
function* runSaga() {
  function* _runSaga() {
    try {
      // get code, breakpoints
      const state: ReduxState = yield select();
      const code = state.js.code;
      const breakpoints = state.breakpoint.items.map(_ => serialize(_));

      // run server debugger with js code and breakpoints
      yield call(() => doAPIPostRequest("exec/run", [code, breakpoints]));
      // move app state to DEBUG_READY
      yield put(move(AppState.DEBUG_READY));
      // update heap, call stack
      yield put(updateHeapRequest());
      yield put(updateCallStackRequest());
    } catch (e: unknown) {
      // show error toast
      // toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(DebuggerActionType.RUN, _runSaga);
}

// stop debugger saga
function* stopSaga() {
  function* _stopSaga() {
    yield put(clearAlgo());
    yield put(clearIrState());
    yield put(clearJS());
    yield put(move(AppState.JS_INPUT));
  }
  yield takeLatest(DebuggerActionType.STOP, _stopSaga);
}

// step result
enum StepResult {
  BREAKED,
  TERMINATED,
  SUCCEED,
}

// step body saga
function mkStepSaga(endpoint: string) {
  function* _stepBodySaga() {
    try {
      // TODO
      const res: StepResult = yield call(() => doAPIPostRequest(endpoint));
      if (res === StepResult.TERMINATED) toast.success("Terminated");
      else if (res === StepResult.BREAKED) toast.info("Breaked");

      // update heap, call stack
      yield put(updateHeapRequest());
      yield put(updateCallStackRequest());
    } catch (e: unknown) {
      toast.error(e as Error);
    }
  }
  return _stepBodySaga;
}

// spec step saga
function* specStepSaga() {
  yield takeLatest(DebuggerActionType.SPEC_STEP, mkStepSaga("exec/specStep"));
}
// spec step over saga
function* specStepOverSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_STEP_OVER,
    mkStepSaga("exec/specStepOver"),
  );
}
// spec step over saga
function* specStepOutSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_STEP_OUT,
    mkStepSaga("exec/specStepOut"),
  );
}
// spec continue saga
function* specContinueSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_CONTINUE,
    mkStepSaga("exec/specContinue"),
  );
}

// js step saga
function* jsStepSaga() {
  yield takeLatest(DebuggerActionType.JS_STEP, mkStepSaga("exec/jsStep"));
}

// js step over saga
function* jsStepOverSaga() {
  yield takeLatest(
    DebuggerActionType.JS_STEP_OVER,
    mkStepSaga("exec/jsStepOver"),
  );
}

// js step out saga
function* jsStepOutSaga() {
  yield takeLatest(
    DebuggerActionType.JS_STEP_OUT,
    mkStepSaga("exec/jsStepOut"),
  );
}

// debugger sagas
export default function* debuggerSaga() {
  yield all([
    runSaga(),
    stopSaga(),
    specStepSaga(),
    specStepOverSaga(),
    specStepOutSaga(),
    jsStepSaga(),
    jsStepOverSaga(),
    jsStepOutSaga(),
    specContinueSaga(),
  ]);
}
