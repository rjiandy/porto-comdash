// @flow

import type {Action} from '../../../general/stores/Action';
import type {RspWspState} from '../types/RspWsp-type';

let initialState = {
  canvasDistributionPrice: [],
  wsp: [],
  isLoading: false,
  error: null,
};

export default function marketUpdateReducer(
  state: RspWspState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_RSP_WSP_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_RSP_WSP_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_RSP_WSP_SUCCEED': {
      let {canvasDistributionPrice, wsp} = action;
      return {
        ...state,
        canvasDistributionPrice,
        wsp,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
