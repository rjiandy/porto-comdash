// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import rspWspWatcher, {rspWspSaga} from '../rspWspSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('RSP WSP Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = rspWspWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_RSP_WSP_REQUESTED', rspWspSaga),
    );
  });
  it('Should manage RSP WSP fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = rspWspSaga();
    expect(saga.next().value).toEqual(call(fetchJSON, '/rspWspData', {}));
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_RSP_WSP_SUCCEED', ...result}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = rspWspSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_RSP_WSP_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
