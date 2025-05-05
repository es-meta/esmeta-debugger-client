import { takeLatest, all, put, call } from "redux-saga/effects";
import { updateStatRequest } from "@/actions";
import { updateStatSuccess } from "@/store/reducers/stats";
import { doAPIGetRequest } from "@/api";

// add breakpoint saga
// TODO add steps
function* statSaga() {
  function* _statSaga() {
    try {
      const iter: number = yield call(() => doAPIGetRequest("meta/iter"));
      const debugString: unknown = yield call(() =>
        doAPIGetRequest("meta/debugString"),
      );
      yield put(updateStatSuccess([Number(iter), JSON.stringify(debugString)]));
      // yield put(updateStatRequest());
    } catch (e: unknown) {
      // show error toast
      // toast.error((e as Error).message);
      console.error(e);
    }
  }
  yield takeLatest(updateStatRequest.type, _statSaga);
}

// debugger sagas
export default function* specSaga() {
  yield all([statSaga()]);
}
