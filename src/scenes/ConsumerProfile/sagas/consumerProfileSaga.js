// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import fetchJSON from '../../../general/helpers/fetchJSON';

export default function* consumerProfileWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_CONSUMER_PROFILE_REQUESTED', consumerProfileSaga);
}

export function* consumerProfileSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/api/consumerProfileData', {});
    yield put({type: 'FETCH_CONSUMER_PROFILE_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_CONSUMER_PROFILE_FAILED', error});
  }
}
