// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* marketUpdateWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_MARKET_UPDATE_REQUESTED', marketUpdateSaga);
}

export function* marketUpdateSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/MarketUpdateData', {});
    yield put({type: 'FETCH_MARKET_UPDATE_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_MARKET_UPDATE_FAILED', error});
  }
}
