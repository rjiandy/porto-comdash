// @flow

import type {Action} from '../../../general/stores/Action';
import type {IndustryUpdateState} from '../types/IndustryUpdate-type';

let initialState = {
  flavorSegmentTrend: [],
  priceSegmentTrend: [],
  industrySize: [],
  isLoading: false,
  error: null,
};

export default function industryUpdateReducer(
  state: IndustryUpdateState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_INDUSTRY_UPDATE_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_INDUSTRY_UPDATE_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_INDUSTRY_UPDATE_SUCCEED': {
      let {flavorSegmentTrend, priceSegmentTrend, industrySize} = action;
      return {
        ...state,
        flavorSegmentTrend,
        priceSegmentTrend,
        industrySize,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
