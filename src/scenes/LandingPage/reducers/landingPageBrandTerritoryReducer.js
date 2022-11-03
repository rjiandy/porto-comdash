// @flow

import type {
  BrandTerritoryState,
  LandingPageBrandTerritoryAction,
} from '../LandingPage-types';

let initialState = {
  salesData: [],
  salesGrowthData: [],
  rspWspData: [],
  territory: 'National',
  isLoading: true,
  error: null,
};

export default function landingPageBrandTerritoryReducer(
  state: BrandTerritoryState = initialState,
  action: LandingPageBrandTerritoryAction
) {
  switch (action.type) {
    case 'FETCH_LANDING_PAGE_TERRITORY_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_LANDING_PAGE_TERRITORY_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_LANDING_PAGE_TERRITORY_SUCCEED': {
      let {sales, salesGrowth, rspWsp} = action;
      return {
        ...state,
        isLoading: false,
        error: null,
        salesData: sales,
        salesGrowthData: salesGrowth,
        rspWspData: rspWsp,
      };
    }
    default:
      return state;
  }
}
