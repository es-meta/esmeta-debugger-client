import { call, put, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  AlgorithmKind,
  SpecActionType,
  updateAlgoSuccess,
  updateAlgoListSuccess,
} from "../store/reducers/Spec";
import { AppState, move } from "../store/reducers/AppState";
import { doAPIGetRequest } from "../util/api";

// get algorithm by fid
function* updateByFidSaga() {
  function* _updateByFid({
    fid,
  }: {
    type: SpecActionType.UPDATE_BY_FID_REQUEST;
    fid: number;
  }) {
    try {
      const [kind, name, rawParams, body, code]: [
        AlgorithmKind,
        string,
        [string, boolean, string][],
        string,
        string,
      ] = yield call(() => doAPIGetRequest(`spec/func/${fid}`));
      const params = rawParams.map(([name, optional, type]) => ({
        name,
        optional,
        type,
      }));
      const algo = { fid, kind, name, params, body, code };
      yield put(updateAlgoSuccess(algo));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(SpecActionType.UPDATE_BY_FID_REQUEST, _updateByFid);
}

// update algorithm list
function* updateAlgoListSaga() {
  function* _updateAlgoList() {
    try {
      const raw: [number, string][] = yield call(() =>
        doAPIGetRequest(`spec/func`),
      );
      const nameMap: Record<string, number> = {};
      raw.forEach(([fid, name]) => {
        nameMap[name] = fid;
      });
      yield put(updateAlgoListSuccess(nameMap));
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

// spec sagas
export default function* specSaga() {
  yield all([updateByFidSaga(), updateAlgoListSaga()]);
}
