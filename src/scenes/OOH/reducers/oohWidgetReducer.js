// @flow

import type {OOHState, OOHAction} from '../type/OOH-type';

let initialState = {
  data: {
    ooh: [],
    oohDetail: [],
  },
  isLoading: true,
  error: null,
};

export default function oohWidgetReducer(
  state: OOHState = initialState,
  action: OOHAction
) {
  switch (action.type) {
    case 'FETCH_OOH_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_OOH_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_OOH_SUCCEED': {
      return {
        ...state,
        data: action.data,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
