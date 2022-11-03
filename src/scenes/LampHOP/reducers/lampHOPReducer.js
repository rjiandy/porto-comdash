// @flow

import type {LampHOPState, LampHOPAction} from '../types/lampHOP-type';

let initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export default function LampHOPReducer(
  state: LampHOPState = initialState,
  action: LampHOPAction
) {
  switch (action.type) {
    case 'FETCH_LAMPHOP_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_LAMPHOP_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_LAMPHOP_SUCCEED': {
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
