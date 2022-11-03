// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import oohSagaWatcher, {oohSaga} from '../oohWidgetSaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('OOH Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = oohSagaWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_OOH_REQUESTED', oohSaga),
    );
  });
  it('Should manage OOH Fetch Logic', () => {
    let result = {
      ooh: [],
      oohDetail: [],
    };
    let saga = oohSaga();
    expect(saga.next().value).toEqual(call(fetchJSON, '/oohData', {}));
    expect(saga.next(result).value).toEqual(
      put({
        type: 'FETCH_OOH_SUCCEED',
        data: {ooh: result.ooh, oohDetail: result.oohDetail},
      }),
    );
  });
});
