// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import consumerProfileWatcher, {
  consumerProfileSaga,
} from '../consumerProfileSaga';
import fetchJSON from '../../../../general/helpers/fetchJSON';

describe('Consumer Profile Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = consumerProfileWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery(
        'FETCH_CONSUMER_PROFILE_REQUESTED',
        consumerProfileSaga
      )
    );
  });
  it('Should manage Consumer Profile fetch logic', () => {
    let result = {foo: 'bar'};
    let saga = consumerProfileSaga();
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/api/consumerProfileData', {})
    );
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_CONSUMER_PROFILE_SUCCEED', ...result})
    );
  });
  it('Should throw when fetchJSON fails', () => {
    let saga = consumerProfileSaga();
    try {
      expect(saga.throw({foo: 'bar'})).toEqual(
        put({
          type: 'FETCH_CONSUMER_PROFILE_FAILED',
          error: {foo: 'bar'},
        })
      );
    } catch (error) {
      expect(error).toEqual({foo: 'bar'});
    }
  });
});
