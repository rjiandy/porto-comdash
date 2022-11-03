// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* somTrendComparisonWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_SOM_TREND_COMPARISON_REQUESTED',
    somTrendComparisonSaga,
  );
}

export function* somTrendComparisonSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/somTrendComparisonData', {});
    yield put({type: 'FETCH_SOM_TREND_COMPARISON_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_SOM_TREND_COMPARISON_FAILED', error});
  }
}
