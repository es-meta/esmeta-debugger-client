import { call, put, select, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

import { ReduxState } from "../store";
import { AppState, AppStateActionType, move } from "../store/reducers/AppState";
import { DebuggerActionType } from "../store/reducers/Debugger";
import { serialize } from "../store/reducers/Breakpoint";
import {
  clearIrState,
  updateHeapRequest,
  updateCallStackRequest,
} from "../store/reducers/IrState";
import { clearJS } from "../store/reducers/JS";
import { clearAlgo } from "../store/reducers/Spec";
import { doAPIPostRequest } from "../util/api/api";
import { Route } from "@/types/route.type";
import { GIVEN_SETTINGS } from "@/constants/settings";

// run debugger saga
function* runSaga() {
  function* _runSaga() {
    try {
      // get code, breakpoints
      const state: ReduxState = yield select();
      const code = state.js.code;
      const breakpoints = state.breakpoint.items.map(_ => serialize(_));

      // run server debugger with js code and breakpoints
      yield put({ type: AppStateActionType.SEND });
      yield call(() => doAPIPostRequest("exec/run", [code, breakpoints]));
      yield put({ type: AppStateActionType.RECIEVE });
      // move app state to DEBUG_READY
      yield put(move(AppState.DEBUG_READY_AT_FRONT));
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

function* stepWithOutBreakSaga() {
  yield takeLatest(
    DebuggerActionType.STEP_WITHOUT_BREAK,
    mkStepSaga("exec/ignoreFlag"),
  );
}

// resume from iter debugger saga
function* resumeFromIterSaga() {
  function* _resumeFromIterSaga() {
    try {
      // get code, breakpoints
      const state: ReduxState = yield select();
      const code = state.js.code;
      const breakpoints = state.breakpoint.items.map(_ => serialize(_));

      const iter =
        GIVEN_SETTINGS.origin.type === "visualizer"
          ? GIVEN_SETTINGS.origin.iter
          : null;

      if (iter === null) {
        throw new Error("No iter given");
      }

      // run server debugger with js code and breakpoints
      yield put({ type: AppStateActionType.SEND });
      yield call(() =>
        doAPIPostRequest("exec/resumeFromIter", [code, breakpoints, iter]),
      );
      yield put({ type: AppStateActionType.RECIEVE });
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
  yield takeLatest(DebuggerActionType.RESUME_FROM_ITER, _resumeFromIterSaga);
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
  REACHEDFRONT,
}

// step body saga
function mkStepSaga(endpoint: Route) {
  function* _stepBodySaga() {
    try {
      // TODO
      yield put({ type: AppStateActionType.SEND });

      const res: StepResult = yield call(() => doAPIPostRequest(endpoint));
      switch (res) {
        case StepResult.TERMINATED:
          toast.success("Terminated");
          yield put(move(AppState.TERMINATED));
          break;
        case StepResult.SUCCEED:
          // toast.success("Succeed");
          yield put(move(AppState.DEBUG_READY));
          break;
        case StepResult.BREAKED:
          toast.info("Breaked");
          yield put(move(AppState.DEBUG_READY));
          break;
        case StepResult.REACHEDFRONT:
          toast.info("Debugger is at first step");
          yield put(move(AppState.DEBUG_READY_AT_FRONT));
          break;
      }

      // update heap, call stack
      yield put(updateHeapRequest());
      yield put(updateCallStackRequest());
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Unknown error : check console");
      }
    }
    yield put({ type: AppStateActionType.RECIEVE });
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
// spec step back saga
function* specStepBackSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_STEP_BACK,
    mkStepSaga("exec/specStepBack"),
  );
}
// spec step back over saga
function* specStepBackOverSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_STEP_BACK_OVER,
    mkStepSaga("exec/specStepBackOver"),
  );
}
// spec step back out saga
function* specStepBackOutSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_STEP_BACK_OUT,
    mkStepSaga("exec/specStepBackOut"),
  );
}
// spec continue saga
function* specContinueSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_CONTINUE,
    mkStepSaga("exec/specContinue"),
  );
}

// spec rewind saga
function* specRewindSaga() {
  yield takeLatest(
    DebuggerActionType.SPEC_REWIND,
    mkStepSaga("exec/specRewind"),
  );
}

// js step saga
function* jsStepSaga() {
  yield takeLatest(DebuggerActionType.JS_STEP, mkStepSaga("exec/esStep"));
}

// js step over saga
function* jsStepOverSaga() {
  yield takeLatest(
    DebuggerActionType.JS_STEP_OVER,
    mkStepSaga("exec/esStepOver"),
  );
}

// js step out saga
function* jsStepOutSaga() {
  yield takeLatest(
    DebuggerActionType.JS_STEP_OUT,
    mkStepSaga("exec/esStepOut"),
  );
}

// debugger sagas
export default function* debuggerSaga() {
  yield all([
    runSaga(),
    resumeFromIterSaga(),
    stepWithOutBreakSaga(),
    stopSaga(),
    specStepSaga(),
    specStepOverSaga(),
    specStepOutSaga(),
    specStepBackSaga(),
    specStepBackOverSaga(),
    specStepBackOutSaga(),
    jsStepSaga(),
    jsStepOverSaga(),
    jsStepOutSaga(),
    specContinueSaga(),
    specRewindSaga(),
  ]);
}
