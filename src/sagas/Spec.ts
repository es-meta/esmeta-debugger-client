import { call, put, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  AlgorithmKind,
  SpecActionType,
  updateAlgoSuccess,
  updateAlgoListSuccess,
  SpecVersion,
  updateVersionSuccess,
  SpecFuncInfo,
} from "../store/reducers/Spec";
import { updateRange } from "../store/reducers/JS";
import { AppState, AppStateActionType, move } from "../store/reducers/AppState";
import { doAPIGetRequest } from "../util/api/api";

// get algorithm by cid
function* updateByCidSaga() {
  function* _updateByCid({
    cid,
  }: {
    type: SpecActionType.UPDATE_BY_CID_REQUEST;
    cid: number;
  }) {
    try {
      yield put({ type: AppStateActionType.SEND });
      const [fid, kind, name, rawParams, dot, code, [start, end]]: [
        number,
        AlgorithmKind,
        string,
        [string, boolean, string][],
        string,
        string,
        [number, number],
      ] = yield call(() => doAPIGetRequest(`state/context/${cid}`));
      yield put({ type: AppStateActionType.RECEIVE });
      const params = rawParams.map(([name, optional, type]) => ({
        name,
        optional,
        type,
      }));
      const algo = { fid, kind, name, params, dot, code };
      yield put(updateAlgoSuccess(algo));
      yield put(updateRange(start, end));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(SpecActionType.UPDATE_BY_CID_REQUEST, _updateByCid);
}

// update algorithm list
function* updateAlgoListSaga() {
  function* _updateAlgoList() {
    try {
      yield put({ type: AppStateActionType.SEND });
      const raw: [number, string][] = yield call(() =>
        doAPIGetRequest(`spec/func`),
      );
      const raw2: [string, SpecFuncInfo][] = yield call(() =>
        doAPIGetRequest(`spec/irToSpecNameMap`),
      );
      yield put({ type: AppStateActionType.RECEIVE });
      const nameMap: Record<string, number> = {};
      raw.forEach(([fid, name]) => {
        nameMap[name] = fid;
      });
      const irToSpecMapping: Record<string, SpecFuncInfo> = {};
      raw2.forEach(([ir, { name, htmlId, isSdo, sdoInfo, isBuiltIn }]) => {
        irToSpecMapping[ir] = { name, htmlId, isSdo, sdoInfo, isBuiltIn };
      });
      yield put(updateAlgoListSuccess(nameMap, irToSpecMapping));
      yield put(move(AppState.JS_INPUT));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(
    SpecActionType.UPDATE_ALGORITHM_LIST_REQUEST,
    _updateAlgoList,
  );
}

// update algorithm list
function* updateVersionInfo() {
  function* _updateVersionInfo() {
    try {
      yield put({ type: AppStateActionType.SEND });
      const rawSpec: SpecVersion = yield call(() =>
        doAPIGetRequest(`spec/version`),
      );
      const rawESMeta: string = yield call(() =>
        doAPIGetRequest(`meta/version`),
      );
      yield put({ type: AppStateActionType.RECEIVE });
      yield put(updateVersionSuccess(rawSpec, rawESMeta));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(SpecActionType.UPDATE_VERSION_REQUEST, _updateVersionInfo);
}

// spec sagas
export default function* specSaga() {
  yield all([updateByCidSaga(), updateAlgoListSaga(), updateVersionInfo()]);
}
