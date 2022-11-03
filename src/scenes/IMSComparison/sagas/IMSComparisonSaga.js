// @flow

import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* IMSComparisonWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_IMS_COMPARISON_DATA_REQUESTED', IMSComparisonSaga);
}

export function* IMSComparisonSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/imsComparisonData', {});
    yield put({
      type: 'FETCH_IMS_COMPARISON_DATA_SUCCEED',
      data: result.imsComparison,
    });
  } catch (error) {
    yield put({type: 'FETCH_IMS_COMPARISON_DATA_FAILED', error});
  }
}
