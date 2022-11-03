// @flow

import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

import watcher, {
  distributionPerformanceSomSaga,
} from '../distributionPerformanceSomSaga';

describe('Distribution Performance Saga Test', () => {
  it('Should watch every FETCH_DISTRIBUTION_PERFORMANCE_SOM_REQUESTED', () => {
    let sagaWatcher = watcher();
    expect(sagaWatcher.next().value).toEqual(
      takeEvery(
        'FETCH_DISTRIBUTION_PERFORMANCE_SOM_REQUESTED',
        distributionPerformanceSomSaga,
      ),
    );
  });
  it('Should put the correct action', () => {
    let result = {distributionPerformanceSom: []};
    let generator = distributionPerformanceSomSaga();
    // generator.next(result);
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/distributionPerformanceSomData', {}),
    );
    expect(generator.next(result).value).toEqual(
      put({type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_SUCCEED', data: []}),
    );
  });
  it('Should throw error when fetchJSON is failing', () => {
    let gen = distributionPerformanceSomSaga();
    try {
      expect(gen.throw({message: 'a'})).toEqual(
        put({
          type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_FAILED',
          error: {message: 'a'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'a'});
    }
  });
});
