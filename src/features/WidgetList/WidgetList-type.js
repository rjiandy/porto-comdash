// @flow

// TODO: use widget type
export type WidgetList = Array<*>;

export type WidgetListState = {
  lanes: Array<WidgetList>;
};

export type WidgetListAction = {
  type: 'LANES_CHANGED';
  newLanes: Array<WidgetList>;
};
