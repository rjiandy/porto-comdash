// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import industryUpdateWatcher, {industryUpdateSaga} from '../industryUpdateSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('Industry Update Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = industryUpdateWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_INDUSTRY_UPDATE_REQUESTED', industryUpdateSaga),
    );
  });
  it('Should manage Industry Update fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = industryUpdateSaga();
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/industryUpdateData', {}),
    );
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_INDUSTRY_UPDATE_SUCCEED', ...result}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = industryUpdateSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_INDUSTRY_UPDATE_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
