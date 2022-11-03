// @flow

import type {Action} from '../../../general/stores/Action';
import type {SwitchingDynamicState} from '../types/SwitchingDynamic-type';

let initialState = {
  switchingDynamic: [],
  isLoading: false,
  error: null,
};

export default function switchingDynamicReducer(
  state: SwitchingDynamicState = initialState,
  action: Action,
): SwitchingDynamicState {
  switch (action.type) {
    case 'FETCH_SWITCHING_DYNAMIC_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_SWITCHING_DYNAMIC_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_SWITCHING_DYNAMIC_SUCCEED': {
      let {switchingDynamic} = action;
      return {
        ...state,
        switchingDynamic,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
