// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

// TODO: remove this
const authorization = {
  header: 'Basic ' + btoa('Tayub:Password1!'),
};

export default function* dstWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_DST_REQUESTED', dstSaga);
}

export function* dstSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/DstData', authorization);
    yield put({
      type: 'FETCH_DST_SUCCEED',
      data: {...result},
    });
  } catch (error) {
    yield put({type: 'FETCH_DST_FAILED', error});
  }
}
