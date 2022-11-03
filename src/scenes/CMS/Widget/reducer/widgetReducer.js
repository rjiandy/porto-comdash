// @flow

import type {WidgetCMSState, WidgetCMSAction} from '../Widget-type';

const initialState = {
  widgets: new Map(),
  error: null,
  isLoading: true,
};

export default function widgetCMSReducer(
  state: WidgetCMSState = initialState,
  action: WidgetCMSAction,
) {
  switch (action.type) {
    case 'FETCH_WIDGET_LIST_SUCCEED': {
      let {widgets} = action;
      return {
        ...state,
        widgets,
        error: null,
        isLoading: false,
      };
    }
    case 'UPDATE_WIDGET_FAILED':
    case 'FETCH_WIDGET_LIST_FAILED': {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }
    case 'UPDATE_WIDGET_REQUESTED':
    case 'FETCH_WIDGET_LIST_REQUESTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    default:
      return state;
  }
}
