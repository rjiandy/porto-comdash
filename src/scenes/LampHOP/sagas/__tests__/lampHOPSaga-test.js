// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import lampHOPWatcher, {lampHOPSaga} from '../lampHOPSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('Lamp HOP Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = lampHOPWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_LAMPHOP_REQUESTED', lampHOPSaga),
    );
  });
  it('Should manage Lamp HOP fetch logic', () => {
    let result = {lampHop: {foo: 'bar'}};
    let saga = lampHOPSaga();
    expect(saga.next().value).toEqual(call(fetchJSON, '/lampHOPData', {}));
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_LAMPHOP_SUCCEED', data: result.lampHop}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = lampHOPSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_LAMPHOP_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
