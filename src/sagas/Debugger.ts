import { call, put, select, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

import { atoms, jotaiStore } from "@/atoms";
import { doAPIPostRequest } from "@/api";
import { ReduxState } from "@/store";
import { AppState, Route, StepResult } from "@/types";
import { move } from "@/store/reducers/app-state";
import { serialize } from "@/store/reducers/breapoint";
import {
  updateHeapRequest,
  updateCallStackRequest,
  updateStatRequest,
} from "@/actions";
import { forceEdit } from "@/store/reducers/js";
import {
  backToProvenanceAction,
  continueAction,
  irStepAction,
  irStepOutAction,
  irStepOverAction,
  iterMinusAction,
  iterPlusAction,
  jsStepAstAction,
  jsStepOutAction,
  jsStepOverAction,
  jsStepStatemmentAction,
  resumeFromIterAction,
  rewindAction,
  runAction,
  specStepAction,
  specStepBackAction,
  specStepBackOutAction,
  specStepBackOverAction,
  specStepOutAction,
  specStepOverAction,
  stopAction,
} from "@/actions";
import { clearIrState } from "@/store/reducers/ir";

// glue jotai as side effect
const GIVEN_SETTINGS = async () => jotaiStore.get(atoms.config.givenConfigAtom);

// run debugger saga
function* runSaga() {
  function* _runSaga() {
    try {
      // get code, breakpoints
      const state: ReduxState = yield select();
      const code = state.js.code;
      const breakpoints = state.breakpoint.items.map(_ => serialize(_));

      // run server debugger with js code and breakpoints
      const reprinted: string | null = yield call(() =>
        doAPIPostRequest("exec/run", [code, breakpoints]),
      );
      if (reprinted !== null) {
        yield put(forceEdit(reprinted));
      }
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
  yield takeLatest(runAction.type, _runSaga);
}

function* backToProvenanceSaga() {
  function* _backToProvenanceSaga({
    payload,
  }: ReturnType<typeof backToProvenanceAction>) {
    try {
      yield call(mkStepSaga("exec/backToProvenance", payload));
    } catch (e: unknown) {
      console.error(e);
    }
  }

  yield takeLatest(backToProvenanceAction.type, _backToProvenanceSaga);
}

// resume from iter debugger saga
function* resumeFromIterSaga() {
  function* _resumeFromIterSaga() {
    try {
      // get code, breakpoints
      const state: ReduxState = yield select();
      const code = state.js.code;
      const breakpoints = state.breakpoint.items.map(_ => serialize(_));

      const givenConfig: Awaited<ReturnType<typeof GIVEN_SETTINGS>> =
        yield call(GIVEN_SETTINGS);
      const iter =
        givenConfig.origin.type === "visualizer"
          ? givenConfig.origin.iter
          : null;

      if (iter === null) {
        throw new Error("No iter given");
      }

      yield call(() =>
        doAPIPostRequest("exec/resumeFromIter", [code, breakpoints, iter]),
      );
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
  yield takeLatest(resumeFromIterAction.type, _resumeFromIterSaga);
}

// stop debugger saga
function* stopSaga() {
  function* _stopSaga() {
    yield put(clearIrState());
    yield put(move(AppState.JS_INPUT));
  }
  yield takeLatest(stopAction.type, _stopSaga);
}

// step body saga
function mkStepSaga(endpoint: Route, bodyObj?: unknown) {
  function* _stepBodySaga() {
    try {
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
  }
  return _stepBodySaga;
}

function* iterPlusSaga() {
  yield takeLatest(iterPlusAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/iterPlus", state.appState.ignoreBP));
  });
}

function* iterMinusSaga() {
  yield takeLatest(iterMinusAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/iterMinus", state.appState.ignoreBP));
  });
}

// ir step saga
function* irStepSaga() {
  yield takeLatest(irStepAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/irStep", state.appState.ignoreBP));
  });
}
// ir step over saga
function* irStepOverSaga() {
  yield takeLatest(irStepOverAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/irStepOver", state.appState.ignoreBP));
  });
}
// ir step over saga
function* irStepOutSaga() {
  yield takeLatest(irStepOutAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/irStepOut", state.appState.ignoreBP));
  });
}
// spec step saga
function* specStepSaga() {
  yield takeLatest(specStepAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStep", state.appState.ignoreBP));
  });
}
// spec step over saga
function* specStepOverSaga() {
  yield takeLatest(specStepOverAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepOver", state.appState.ignoreBP));
  });
}
// spec step over saga
function* specStepOutSaga() {
  yield takeLatest(specStepOutAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepOut", state.appState.ignoreBP));
  });
}
// spec step back saga
function* specStepBackSaga() {
  yield takeLatest(specStepBackAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepBack", state.appState.ignoreBP));
  });
}
// spec step back over saga
function* specStepBackOverSaga() {
  yield takeLatest(specStepBackOverAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepBackOver", state.appState.ignoreBP));
  });
}
// spec step back out saga
function* specStepBackOutSaga() {
  yield takeLatest(specStepBackOutAction.type, function* () {
    const state: ReduxState = yield select();
    yield call(mkStepSaga("exec/specStepBackOut", state.appState.ignoreBP));
  });
}
// spec continue saga
function* specContinueSaga() {
  yield takeLatest(continueAction.type, mkStepSaga("exec/specContinue"));
}

// spec rewind saga
function* specRewindSaga() {
  yield takeLatest(rewindAction.type, mkStepSaga("exec/specRewind"));
}

// js ast step saga
function* jsAstStepSaga() {
  yield takeLatest(jsStepAstAction.type, mkStepSaga("exec/esAstStep"));
}

// js statement step saga
function* jsStatementStepSaga() {
  yield takeLatest(
    jsStepStatemmentAction.type,
    mkStepSaga("exec/esStatementStep"),
  );
}

// js step over saga
function* jsStepOverSaga() {
  yield takeLatest(jsStepOverAction.type, mkStepSaga("exec/esStepOver"));
}

// js step out saga
function* jsStepOutSaga() {
  yield takeLatest(jsStepOutAction.type, mkStepSaga("exec/esStepOut"));
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
