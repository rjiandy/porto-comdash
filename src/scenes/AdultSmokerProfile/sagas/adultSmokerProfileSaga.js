// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* adultSmokerProfileWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_ADULT_SMOKER_PROFILE_REQUESTED',
    adultSmokerProfileSaga,
  );
}

export function* adultSmokerProfileSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/smokerProfileData', {});
    yield put({type: 'FETCH_ADULT_SMOKER_PROFILE_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_ADULT_SMOKER_PROFILE_FAILED', error});
  }
}
