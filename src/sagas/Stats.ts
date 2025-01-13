import { call, put, takeLatest, all } from "redux-saga/effects";
import { toast } from "react-toastify";

import { AppStateActionType, } from "../store/reducers/AppState";
import { doAPIGetRequest } from "../util/api/api";
import { StatActionType, updateStatSuccess } from "@/store/reducers/Stats";

// update algorithm list
function* updateStat() {
  function* _updateVersionInfo() {
    try {
      yield put({ type: AppStateActionType.SEND });
      const iter: string = yield call(() =>
        doAPIGetRequest(`meta/iter`),
      );
      const cursor: string = yield call(() =>
        doAPIGetRequest(`meta/debugString`),
      );
      yield put({ type: AppStateActionType.RECEIVE });
      yield put(updateStatSuccess(JSON.stringify({ iter, cursor })));
    } catch (e: unknown) {
      // show error toast
      toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(StatActionType.UPDATE_STAT_REQUEST, _updateVersionInfo);
}

// spec sagas
export default function* statSaga() {
  yield all([updateStat()]);
}
