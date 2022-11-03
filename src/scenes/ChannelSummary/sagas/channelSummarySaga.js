// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* channelSummaryWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_CHANNEL_SUMMARY_REQUESTED', channelSummarySaga);
}

export function* channelSummarySaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/ChannelSummaryData', {});
    yield put({type: 'FETCH_CHANNEL_SUMMARY_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_CHANNEL_SUMMARY_FAILED', error});
  }
}
