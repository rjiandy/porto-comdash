// @flow

import type {Action} from '../../../general/stores/Action';
import type {BrandProductImageryState} from '../types/BrandProductImagery-type';

let initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export default function brandProductImageryReducer(
  state: BrandProductImageryState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_BRAND_PRODUCT_IMAGERY_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_BRAND_PRODUCT_IMAGERY_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_BRAND_PRODUCT_IMAGERY_SUCCEED': {
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
