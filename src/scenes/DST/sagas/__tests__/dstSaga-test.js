// @flow

import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

import watcher, {dstSaga} from '../dstSaga';

// TODO: remove this
const authorization = {
  header: 'Basic ' + btoa('Tayub:Password1!'),
};

describe('DST Saga Test', () => {
  it('Should watch every FETCH_DST_REQUESTED', () => {
    let sagaWatcher = watcher();
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('FETCH_DST_REQUESTED', dstSaga),
    );
  });
  it('Should put the correct action', () => {
    let result = {consumerBrand: [], kpiAchievement: []};
    let generator = dstSaga();
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/DstData', authorization),
    );
    expect(generator.next(result).value).toEqual(
      put({
        type: 'FETCH_DST_SUCCEED',
        data: {consumerBrand: [], kpiAchievement: []},
      }),
    );
  });
  it('Should throw error when fetchJSON is failing', () => {
    let gen = dstSaga();
    try {
      expect(gen.throw({message: 'a'})).toEqual(
        put({
          type: 'FETCH_DST_FAILED',
          error: {message: 'a'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'a'});
    }
  });
});
