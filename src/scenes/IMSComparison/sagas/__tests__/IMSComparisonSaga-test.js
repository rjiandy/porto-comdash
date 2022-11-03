// @flow

import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';
import watcher, {IMSComparisonSaga} from '../IMSComparisonSaga';

describe('IMSComparison saga test', () => {
  it('Should watch every FETCH_IMS_COMPARISON_DATA_REQUESTED', () => {
    let sagaWatcher = watcher();
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('FETCH_IMS_COMPARISON_DATA_REQUESTED', IMSComparisonSaga),
    );
  });
  it('Should put the correct action', () => {
    let result = {imsComparison: 1};
    let generator = IMSComparisonSaga();
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/imsComparisonData', {}),
    );
    expect(generator.next(result).value).toEqual(
      put({type: 'FETCH_IMS_COMPARISON_DATA_SUCCEED', data: 1}),
    );
  });
  it('Should throw error when fetchJSON is failing', () => {
    let gen = IMSComparisonSaga();
    try {
      expect(gen.throw({message: 'a'})).toEqual(
        put({type: 'FETCH_IMS_COMPARISON_DATA_FAILED', error: {message: 'a'}}),
      );
    } catch (error) {
      expect(error).toEqual({message: 'a'});
    }
  });
});
