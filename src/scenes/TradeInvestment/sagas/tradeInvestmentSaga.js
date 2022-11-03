// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* tradeInvestmentWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_TRADE_INVESTMENT_REQUESTED', tradeInvestmentSaga);
}

export function* tradeInvestmentSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/TradeCovData', {});
    yield put({type: 'FETCH_TRADE_INVESTMENT_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_TRADE_INVESTMENT_FAILED', error});
  }
}
