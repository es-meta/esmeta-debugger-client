import { call, put, select, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

import { ReduxState } from "@/store";
import { AppState, AppStateActionType, move } from "@/store/reducers/AppState";
import { DebuggerActionType } from "@/store/reducers/Debugger";
import { serialize } from "@/store/reducers/Breakpoint";
import {
  clearIrState,
  updateHeapRequest,
  updateCallStackRequest,
} from "@/store/reducers/IrState";
import { clearJS, edit } from "@/store/reducers/JS";
import { clearAlgo } from "@/store/reducers/Spec";
import { doAPIPostRequest } from "@/util/api/api";
import { Route } from "@/types/route.type";
import { GIVEN_SETTINGS } from "@/constants/settings";
import { updateStatRequest } from "@/store/reducers/Stats";

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
      const reprinted: string | null = yield call(() => doAPIPostRequest("exec/run", [code, breakpoints]));
      if (reprinted !== null) {
        yield put(edit(reprinted));
      }
      yield put({ type: AppStateActionType.RECEIVE });
      // move app state to DEBUG_READY
      yield put(move(AppState.DEBUG_READY_AT_FRONT));
      // update heap, call stack
      yield put(updateHeapRequest());
      yield put(updateCallStackRequest());
      yield put(updateStatRequest());
    } catch (e: unknown) {
      // show error toast
      // toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(DebuggerActionType.RUN, _runSaga);
}

function* backToProvenanceSaga() {
  function* _backToProvenanceSaga({
    address,
  }: {
    type: DebuggerActionType.BACK_TO_PROVENANCE;
    address: string;
  }) {
    try {
      // const { irState }: ReduxState = yield select();
      // const { callStack, contextIdx } = irState;
      // const env: Environment =
      //   callStack.length > 0 ? callStack[contextIdx].env : [];
      // env.filter(e => e[0] === "return")[0][1];

      yield call(mkStepSaga("exec/backToProvenance", address));
    } catch (e: unknown) {
      // show error toast
      // toast.error((e as Error).message);
      console.error(e);
    }
  }

  yield takeLatest(
    DebuggerActionType.BACK_TO_PROVENANCE,
    _backToProvenanceSaga,
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
      yield put({ type: AppStateActionType.RECEIVE });
      // move app state to DEBUG_READY
      yield put(move(AppState.DEBUG_READY));
      // update heap, call stack
      yield put(updateHeapRequest());
      yield put(updateCallStackRequest());
      yield put(updateStatRequest());
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
function mkStepSaga(endpoint: Route, bodyObj?: unknown) {
  function* _stepBodySaga() {
    try {
      yield put({ type: AppStateActionType.SEND });

      console.log("endpoint", endpoint, "body", bodyObj);

      const res: StepResult = yield call(() =>
        doAPIPostRequest(endpoint, bodyObj),
      );
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

      // update heap, call stack, and stats
      yield put(updateHeapRequest());
      yield put(updateCallStackRequest());
      yield put(updateStatRequest());
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Unknown error : check console");
      }
    }
    yield put({ type: AppStateActionType.RECEIVE });
  }
  return _stepBodySaga;
}

function* iterPlusSaga() {
  yield takeLatest(DebuggerActionType.ITER_PLUS, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/iterPlus", state.appState.ignoreBP));
  });
}

function* iterMinusSaga() {
  yield takeLatest(DebuggerActionType.ITER_MINUS, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/iterMinus", state.appState.ignoreBP));
  });
}

// ir step saga
function* irStepSaga() {
  yield takeLatest(DebuggerActionType.IR_STEP, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/irStep", state.appState.ignoreBP));
  });
}
// ir step over saga
function* irStepOverSaga() {
  yield takeLatest(DebuggerActionType.IR_STEP_OVER, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/irStepOver", state.appState.ignoreBP));
  });
}
// ir step over saga
function* irStepOutSaga() {
  yield takeLatest(DebuggerActionType.IR_STEP_OUT, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/irStepOut", state.appState.ignoreBP));
  });
}
// spec step saga
function* specStepSaga() {
  yield takeLatest(DebuggerActionType.SPEC_STEP, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStep", state.appState.ignoreBP));
  });
}
// spec step over saga
function* specStepOverSaga() {
  yield takeLatest(DebuggerActionType.SPEC_STEP_OVER, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepOver", state.appState.ignoreBP));
  });
}
// spec step over saga
function* specStepOutSaga() {
  yield takeLatest(DebuggerActionType.SPEC_STEP_OUT, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepOut", state.appState.ignoreBP));
  });
}
// spec step back saga
function* specStepBackSaga() {
  yield takeLatest(DebuggerActionType.SPEC_STEP_BACK, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepBack", state.appState.ignoreBP));
  });
}
// spec step back over saga
function* specStepBackOverSaga() {
  yield takeLatest(DebuggerActionType.SPEC_STEP_BACK_OVER, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepBackOver", state.appState.ignoreBP));
  });
}
// spec step back out saga
function* specStepBackOutSaga() {
  yield takeLatest(DebuggerActionType.SPEC_STEP_BACK_OUT, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepBackOut", state.appState.ignoreBP));
  });
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

// js ast step saga
function* jsAstStepSaga() {
  yield takeLatest(DebuggerActionType.JS_STEP_AST, mkStepSaga("exec/esAstStep"));
}


// js statement step saga
function* jsStatementStepSaga() {
  yield takeLatest(DebuggerActionType.JS_STEP_STATEMENT, mkStepSaga("exec/esStatementStep"));
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
    stopSaga(),
    backToProvenanceSaga(),
    irStepSaga(),
    irStepOverSaga(),
    irStepOutSaga(),
    specStepSaga(),
    specStepOverSaga(),
    specStepOutSaga(),
    specStepBackSaga(),
    specStepBackOverSaga(),
    specStepBackOutSaga(),
    jsAstStepSaga(),
    jsStatementStepSaga(),
    jsStepOverSaga(),
    jsStepOutSaga(),
    iterPlusSaga(),
    iterMinusSaga(),
    specContinueSaga(),
    specRewindSaga(),
  ]);
}
