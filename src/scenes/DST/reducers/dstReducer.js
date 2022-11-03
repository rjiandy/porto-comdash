// @flow

import type {Action} from '../../../general/stores/Action';
import type {DSTState} from '../types/DST-type';

let initialState = {
  data: {kpiAchievement: [], consumerBrand: []},
  isLoading: false,
  error: null,
};

export default function distributionPerformanceSomReducer(
  state: DSTState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_DST_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_DST_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_DST_SUCCEED': {
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
