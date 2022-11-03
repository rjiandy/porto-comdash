// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import switchingDynamicWatcher, {
  switchingDynamicSaga,
} from '../switchingDynamicSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('SOM Trend Comparison Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = switchingDynamicWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_SWITCHING_DYNAMIC_REQUESTED', switchingDynamicSaga),
    );
  });
  it('Should manage SOM Trend Comparison fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = switchingDynamicSaga();
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/switchingDynamicData', {}),
    );
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_SWITCHING_DYNAMIC_SUCCEED', ...result}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = switchingDynamicSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_SWITCHING_DYNAMIC_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
