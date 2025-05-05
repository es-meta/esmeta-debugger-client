import { call, put, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";
import { doAPIGetRequest } from "@/api";
import {
  Algorithm,
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
      ][] = yield call(() => doAPIGetRequest("state/callStack"));
      const callStack = raw.map(([fid, name, steps, isExit, env, visited]) => ({
        fid,
        name,
        steps,
        isExit,
        env,
        algo: null as unknown as Algorithm,
        visited,
      }));

      for (let i = 0; i < callStack.length; i++) {
        const [fid, kind, name, rawParams, dot, code, [start, end]]: [
          number,
          AlgorithmKind,
          string,
          [string, boolean, string][],
          string,
          string,
          [number, number],
        ] = yield call(() => doAPIGetRequest(`state/context/${i}`));
        const params = rawParams.map(([name, optional, type]) => ({
          name,
          optional,
          type,
        }));
        const algo = { fid, kind, name, params, dot, code };
        callStack[i].algo = algo;
        (callStack[i] as Context).jsRange = [start, end]; // add jsRange to callStack
        ///
      }
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
