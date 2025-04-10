import { call, put, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

// import { ReduxState } from "../store";
import {
  Environment,
  CallStack,
  IrStateActionType,
  updateContextIdx,
  updateHeapSuccess,
  updateCallStackSuccess,
} from "../store/reducers/IrState";
import {
  Algorithm,
  AlgorithmKind,
  updateAlgoByCidRequset,
} from "../store/reducers/Spec";
import { doAPIGetRequest } from "../util/api/api";
import { AppStateActionType } from "@/store/reducers/AppState";
import { Heap } from "@/types/heap.type";

// heap saga
function* updateHeapSaga() {
  function* _updateHeap() {
    try {
      yield put({ type: AppStateActionType.SEND });
      const heap: Heap = yield call(() => doAPIGetRequest("state/heap"));
      yield put({ type: AppStateActionType.RECEIVE });
      yield put(updateHeapSuccess(heap));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(IrStateActionType.UPDATE_HEAP_REQUEST, _updateHeap);
}

// call stack saga
function* updateCallStackSaga() {
  function* _updateCallStack() {
    try {
      const raw: [
        number,
        string,
        number[],
        boolean,
        Environment,
        number[][],
      ][] = yield call(() => doAPIGetRequest("state/callStack"));
      const callStack: CallStack = raw.map(
        ([fid, name, steps, isExit, env, visited]) => ({
          fid,
          name,
          steps,
          isExit,
          env,
          algo: null as unknown as Algorithm,
          visited,
        }),
      );

      for (let i = 0; i < callStack.length; i++) {
        const [fid, kind, name, rawParams, dot, code]: [
          number,
          AlgorithmKind,
          string,
          [string, boolean, string][],
          string,
          string,
          [number, number],
        ] = yield call(() => doAPIGetRequest(`state/context/${i}`));
        yield put({ type: AppStateActionType.RECEIVE });
        const params = rawParams.map(([name, optional, type]) => ({
          name,
          optional,
          type,
        }));
        const algo = { fid, kind, name, params, dot, code };
        callStack[i].algo = algo;
        ///
      }
      yield put(updateCallStackSuccess(callStack));
      yield put(updateContextIdx(0));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(
    IrStateActionType.UPDATE_CALL_STACK_REQUEST,
    _updateCallStack,
  );
}

// context index saga
function* updateContextIdxSaga() {
  function* _updateContextIdx({
    idx,
  }: {
    type: IrStateActionType.UPDATE_CONTEXT_INDEX;
    idx: number;
  }) {
    try {
      // const state: ReduxState = yield select();
      yield put(updateAlgoByCidRequset(idx));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }

  yield takeLatest(IrStateActionType.UPDATE_CONTEXT_INDEX, _updateContextIdx);
}

// ir state sagas
export default function* irStateSaga() {
  yield all([updateHeapSaga(), updateCallStackSaga(), updateContextIdxSaga()]);
}
