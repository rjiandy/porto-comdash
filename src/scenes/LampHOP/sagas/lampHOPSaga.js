// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* lampHOPWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_LAMPHOP_REQUESTED', lampHOPSaga);
}

export function* lampHOPSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/lampHOPData', {});
    yield put({type: 'FETCH_LAMPHOP_SUCCEED', data: result.lampHop});
  } catch (error) {
    yield put({type: 'FETCH_LAMPHOP_FAILED', error});
  }
}
