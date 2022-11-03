// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* industryUpdateWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_INDUSTRY_UPDATE_REQUESTED', industryUpdateSaga);
}

export function* industryUpdateSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/industryUpdateData', {});
    yield put({type: 'FETCH_INDUSTRY_UPDATE_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_INDUSTRY_UPDATE_FAILED', error});
  }
}
