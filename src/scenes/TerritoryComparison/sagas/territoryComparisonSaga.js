// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* territoryComparisonWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_TERRITORY_COMPARISON_REQUESTED',
    territoryComparisonSaga,
  );
}

export function* territoryComparisonSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/territoryComparisonData', {});
    yield put({type: 'FETCH_TERRITORY_COMPARISON_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_TERRITORY_COMPARISON_FAILED', error});
  }
}
