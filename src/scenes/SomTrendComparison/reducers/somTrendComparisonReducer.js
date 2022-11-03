// @flow

import type {Action} from '../../../general/stores/Action';
import type {SomTrendComparisonState} from '../types/SomTrendComparison-type';

let initialState = {
  somTrendComparison: [],
  isLoading: false,
  error: null,
};

export default function somTrendComparisonReducer(
  state: SomTrendComparisonState = initialState,
  action: Action
): SomTrendComparisonState {
  switch (action.type) {
    case 'FETCH_SOM_TREND_COMPARISON_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_SOM_TREND_COMPARISON_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_SOM_TREND_COMPARISON_SUCCEED': {
      let {somTrendComparison} = action;
      return {
        ...state,
        somTrendComparison,
        isLoading: false,
        error: null,
      };
    }
    default: return state;
  }
}
