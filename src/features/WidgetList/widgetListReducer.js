// @flow

import widgets, {widgetLibraryList} from '../../routes/widgets';

import type {WidgetListState, WidgetListAction} from './WidgetList-type';

let initialState = {
  lanes: [[...widgets], [...widgetLibraryList]],
};

export default function widgetListReducer(
  state: WidgetListState = initialState,
  action: WidgetListAction,
) {
  switch (action.type) {
    case 'LANES_CHANGED': {
      return {
        ...state,
        lanes: action.newLanes,
      };
    }
    default:
      return state;
  }
}
