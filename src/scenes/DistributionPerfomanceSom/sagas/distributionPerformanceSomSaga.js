// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

// NOTE: prettier caused a flow error, so I made the function name shorter
export default function* distPerfSomWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_DISTRIBUTION_PERFORMANCE_SOM_REQUESTED',
    distributionPerformanceSomSaga,
  );
}

export function* distributionPerformanceSomSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/distributionPerformanceSomData', {});
    yield put({
      type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_SUCCEED',
      data: result.distributionPerformanceSom,
    });
  } catch (error) {
    yield put({type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_FAILED', error});
  }
}
