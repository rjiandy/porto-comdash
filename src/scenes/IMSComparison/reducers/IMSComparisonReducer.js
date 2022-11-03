// @flow

import type {IMSComparisonState, IMSComparisonAction} from '../types/IMSComparison-type';

let initialState = {
  imsComparisonData: [],
  isImsComparisonWidgetLoading: true,
  error: null,
};

export default function imsComparisonReducer(state: IMSComparisonState = initialState, action: IMSComparisonAction) {
  switch (action.type) {
    case 'FETCH_IMS_COMPARISON_DATA_REQUESTED': {
      return {
        ...state,
        error: null,
        isImsComparisonWidgetLoading: true,
      };
    }
    case 'FETCH_IMS_COMPARISON_DATA_SUCCEED': {
      return {
        ...state,
        error: null,
        isImsComparisonWidgetLoading: false,
        imsComparisonData: action.data,
      };
    }
    case 'FETCH_IMS_COMPARISON_DATA_FAILED': {
      return {
        ...state,
        isImsComparisonWidgetLoading: false,
        error: action.error,
      };
    }
    default: return state;
  }
}
