// @flow

import type {Action} from '../../../general/stores/Action';
import type {TerritoryComparisonState} from '../types/TerritoryComparisonState-type';

let initialState = {
  territoryComparison: [],
  isLoading: false,
  error: null,
};

function territoryComparisonReducer(
  state: TerritoryComparisonState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_TERRITORY_COMPARISON_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_TERRITORY_COMPARISON_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_TERRITORY_COMPARISON_SUCCEED': {
      let {territoryComparison} = action;
      return {
        ...state,
        territoryComparison,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}

export default territoryComparisonReducer;
