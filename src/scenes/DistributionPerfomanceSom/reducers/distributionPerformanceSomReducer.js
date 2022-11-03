// @flow

import type {Action} from '../../../general/stores/Action';
import type {DistributionPerformanceSomState} from '../types/DistributionPerformanceSom-type';

let initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export default function distributionPerformanceSomReducer(
  state: DistributionPerformanceSomState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_SUCCEED': {
      let {data} = action;
      return {
        ...state,
        data,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
