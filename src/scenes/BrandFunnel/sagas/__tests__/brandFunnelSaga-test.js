// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import brandFunnelWatcher, {brandFunnelSaga} from '../brandFunnelSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('Brand Funnel Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = brandFunnelWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_BRAND_FUNNEL_REQUESTED', brandFunnelSaga),
    );
  });
  it('Should manage Brand Funnel fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = brandFunnelSaga();
    expect(saga.next().value).toEqual(call(fetchJSON, '/brandFunnels', {}));
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_BRAND_FUNNEL_SUCCEED', ...result}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = brandFunnelSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_BRAND_FUNNEL_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
