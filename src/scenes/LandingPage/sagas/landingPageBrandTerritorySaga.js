// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

// TODO: remove this

function* landingPageTerritoryManagerWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_LANDING_PAGE_TERRITORY_REQUESTED',
    landingPageTerritoryManagerSaga,
  );
}

export function* landingPageTerritoryManagerSaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/LandingPageTerritoryBrandData', {});
    yield put({type: 'FETCH_LANDING_PAGE_TERRITORY_SUCCEED', ...result});
  } catch (error) {
    yield put({type: 'FETCH_LANDING_PAGE_TERRITORY_FAILED', error});
  }
}

// Note: there is prettier and eslint conflict about separate generator types
export default landingPageTerritoryManagerWatcher;
