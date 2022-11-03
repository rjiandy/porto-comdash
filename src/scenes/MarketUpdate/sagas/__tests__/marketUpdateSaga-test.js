// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import marketUpdateWatcher, {marketUpdateSaga} from '../marketUpdateSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('Market Update Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = marketUpdateWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_MARKET_UPDATE_REQUESTED', marketUpdateSaga),
    );
  });
  it('Should manage Market Update fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = marketUpdateSaga();
    expect(saga.next().value).toEqual(call(fetchJSON, '/MarketUpdateData', {}));
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_MARKET_UPDATE_SUCCEED', ...result}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = marketUpdateSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_MARKET_UPDATE_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
