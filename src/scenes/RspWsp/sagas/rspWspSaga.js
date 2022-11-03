// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* rspWspWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_RSP_WSP_REQUESTED', rspWspSaga);
}

export function* rspWspSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/rspWspData', {});
    yield put({type: 'FETCH_RSP_WSP_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_RSP_WSP_FAILED', error});
  }
}
