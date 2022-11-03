// @flow

import {put, call, takeEvery} from 'redux-saga/effects';

import territoryManagerWatcher, {
  landingPageTerritoryManagerSaga,
} from '../landingPageBrandTerritorySaga';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('Landing Page Territory Manager Saga', () => {
  it('Should takeEvery fetch action', () => {
    let watcher = territoryManagerWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery(
        'FETCH_LANDING_PAGE_TERRITORY_REQUESTED',
        landingPageTerritoryManagerSaga,
      ),
    );
  });
  it('Should manage Landing Page Territory Fetch Logic', () => {
    let result = {a: 1};
    let saga = landingPageTerritoryManagerSaga();
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/LandingPageTerritoryBrandData', {}),
    );
    expect(saga.next(result).value).toEqual(
      put({type: 'FETCH_LANDING_PAGE_TERRITORY_SUCCEED', ...result}),
    );
  });
});
