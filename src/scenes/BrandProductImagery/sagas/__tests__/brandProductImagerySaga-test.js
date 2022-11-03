// @flow

import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

import brandProductImageryWatcher, {
  brandProductImagerySaga,
} from '../brandProductImagerySaga';

describe('Brand Product Imagery Saga Test', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = brandProductImageryWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery(
        'FETCH_BRAND_PRODUCT_IMAGERY_REQUESTED',
        brandProductImagerySaga,
      ),
    );
  });
  it('Should manage RSP WSP fetch logic', () => {
    let result = {brandProductImagery: ['foo', 'bar']};
    let saga = brandProductImagerySaga();
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/brandProductImageryData', {}),
    );
    expect(saga.next(result).value).toEqual(
      put({
        type: 'FETCH_BRAND_PRODUCT_IMAGERY_SUCCEED',
        data: result.brandProductImagery,
      }),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = brandProductImagerySaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_BRAND_PRODUCT_IMAGERY_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
