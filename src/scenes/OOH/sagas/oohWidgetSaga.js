// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* oohSagaWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_OOH_REQUESTED', oohSaga);
}

export function* oohSaga(): Generator<*, *, *> {
  try {
    let data = yield call(fetchJSON, '/oohData', {});
    yield put({type: 'FETCH_OOH_SUCCEED', data});
  } catch (error) {
    yield put({type: 'FETCH_OOH_FAILED', error});
  }
}
