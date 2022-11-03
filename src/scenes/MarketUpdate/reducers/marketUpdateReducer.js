// @flow

import type {Action} from '../../../general/stores/Action';
import type {MarketUpdateState} from '../types/MarketUpdate-type';

let initialState = {
  brandPerformance: [],
  companyPerformance: [],
  topRightChart: [],
  industrySizeGainLose: [],
  isLoading: false,
  error: null,
};

export default function marketUpdateReducer(
  state: MarketUpdateState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_MARKET_UPDATE_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_MARKET_UPDATE_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_MARKET_UPDATE_SUCCEED': {
      let {
        brandPerformance,
        companyPerformance,
        topRightChart,
        industrySizeGainLose,
      } = action;
      return {
        ...state,
        brandPerformance,
        companyPerformance,
        topRightChart,
        industrySizeGainLose,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
