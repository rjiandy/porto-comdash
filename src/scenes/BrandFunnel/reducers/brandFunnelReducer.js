// @flow

import type {Action} from '../../../general/stores/Action';
import type {BrandFunnelState} from '../types/BrandFunnel-type';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export default function brandFunnelReducer(
  state: BrandFunnelState = initialState,
  action: Action,
) {
  switch (action.type) {
    case 'FETCH_BRAND_FUNNEL_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_BRAND_FUNNEL_SUCCEED': {
      return {
        ...state,
        data: action.brandFunnel,
        isLoading: false,
        error: null,
      };
    }
    case 'FETCH_BRAND_FUNNEL_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    default: {
      return state;
    }
  }
}
