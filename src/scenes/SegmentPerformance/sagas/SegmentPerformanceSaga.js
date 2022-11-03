// @flow

import {takeEvery, put, call} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* segmentPerformanceWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_SEGMENT_PERFORMANCE_REQUESTED',
    segmentPerformanceSaga,
  );
}

export function* segmentPerformanceSaga(): Generator<*, *, *> {
  try {
    let data = yield call(fetchJSON, '/segmentPerformanceData', {});
    let {bubbleChart, flavorSegment, volumeGrowth} = data;
    yield put({
      type: 'FETCH_SEGMENT_PERFORMANCE_SUCCEED',
      bubbleChart: bubbleChart,
      flavorSegment: flavorSegment,
      volumeGrowth: volumeGrowth,
    });
  } catch (err) {
    yield put({type: 'FETCH_SEGMENT_PERFORMANCE_FAILED', error: err});
  }
}
