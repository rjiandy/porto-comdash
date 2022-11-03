// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* brandFunnelWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_BRAND_FUNNEL_REQUESTED', brandFunnelSaga);
}

export function* brandFunnelSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/brandFunnels', {});
    yield put({type: 'FETCH_BRAND_FUNNEL_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_BRAND_FUNNEL_FAILED', error});
  }
}
