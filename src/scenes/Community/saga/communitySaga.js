// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import fetchJSON from '../../../general/helpers/fetchJSON';

export default function* communityWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_COMMUNITY_REQUESTED', communitySaga);
}

export function* communitySaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/api/communityData', {});
    yield put({
      type: 'FETCH_COMMUNITY_SUCCEED',
      data: result,
    });
  } catch (error) {
    yield put({type: 'FETCH_COMMUNITY_FAILED', error});
  }
}
