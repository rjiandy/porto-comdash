// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* switchingDynamicWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_SWITCHING_DYNAMIC_REQUESTED', switchingDynamicSaga);
}

export function* switchingDynamicSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/switchingDynamicData', {});
    yield put({type: 'FETCH_SWITCHING_DYNAMIC_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_SWITCHING_DYNAMIC_FAILED', error});
  }
}
