// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* eventWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_EVENT_ACHIEVEMENT_REQUESTED', eventSaga);
}

export function* eventSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/EventAchData', {});
    yield put({type: 'FETCH_EVENT_ACHIEVEMENT_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_EVENT_ACHIEVEMENT_FAILED', error});
  }
}
