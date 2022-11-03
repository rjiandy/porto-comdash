// @flow

import type {Action} from '../../../general/stores/Action';
// import type {TradeInvestmentState} from '../types/TradeInvestment-type';

let initialState = {};

export default function tradeInvestmentReducer(
  state: * = initialState, // TODO change this to the correct type
  action: Action,
) {
  switch (action.type) {
    case 'FETCH_TRADE_INVESTMENT_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_TRADE_INVESTMENT_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_TRADE_INVESTMENT_SUCCEED': {
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
