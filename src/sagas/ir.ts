import { call, put, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";
import { doAPIGetRequest } from "@/api";
import {
  AlgorithmKind,
  Environment,
  CallStack,
  Heap,
  Context,
} from "@/types";
import {
  updateCallStackSuccess,
  updateContextIdx,
  updateHeapSuccess,
} from "@/store/reducers/ir";
import { updateCallStackRequest, updateHeapRequest } from "@/actions";

// heap saga
function* updateHeapSaga() {
  function* _updateHeap() {
    try {
      const heap: Heap = yield call(() => doAPIGetRequest("state/heap"));
      yield put(updateHeapSuccess(heap));
    } catch (e: unknown) {
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(updateHeapRequest.type, _updateHeap);
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
        AlgorithmKind,
        [string, boolean, string][],
        string,
        string,
        [number, number],
      ][] = yield call(() => doAPIGetRequest("state/callStack"));
      const callStack = raw.map(([fid, name, steps, isExit, env, visited, kind, rawParams, dot, code, [start, end]]) => ({
        fid,
        name,
        steps,
        isExit,
        env,
        algo: {
          fid,
          kind,
          name,
          params: rawParams.map(([name, optional, type]) => ({
            name,
            optional,
            type,
          })),
          dot,
          code,
        },
        visited,
        jsRange: [start, end],
      } satisfies Context));

     
      yield put(updateCallStackSuccess(callStack as CallStack));
      yield put(updateContextIdx(0));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(updateCallStackRequest.type, _updateCallStack);
}

export default function* irStateSaga() {
  yield all([updateHeapSaga(), updateCallStackSaga()]);
}
