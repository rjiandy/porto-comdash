// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import somTrendComparisonWatcher, {
  somTrendComparisonSaga,
} from '../somTrendComparisonSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('SOM Trend Comparison Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = somTrendComparisonWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_SOM_TREND_COMPARISON_REQUESTED', somTrendComparisonSaga),
    );
  });
  it('Should manage SOM Trend Comparison fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = somTrendComparisonSaga();
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/somTrendComparisonData', {}),
    );
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_SOM_TREND_COMPARISON_SUCCEED', ...result}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = somTrendComparisonSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_SOM_TREND_COMPARISON_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
