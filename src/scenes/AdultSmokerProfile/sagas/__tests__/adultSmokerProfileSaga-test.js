// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import adultSmokerProfileWatcher, {
  adultSmokerProfileSaga,
} from '../adultSmokerProfileSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('Adult Smoker Profile Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = adultSmokerProfileWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_ADULT_SMOKER_PROFILE_REQUESTED', adultSmokerProfileSaga),
    );
  });
  it('Should manage Adult Smoker Profile fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = adultSmokerProfileSaga();
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/smokerProfileData', {}),
    );
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_ADULT_SMOKER_PROFILE_SUCCEED', ...result}),
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = adultSmokerProfileSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_ADULT_SMOKER_PROFILE_FAILED',
          error: {foo: 'bar'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
