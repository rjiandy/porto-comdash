// @flow

import type {GroupMetadata} from '../UserGroup/UserGroup-type';

export type ID = number;

export type Widget = {
  id: ID;
  widgetName: string;
  title: string;
  groups: Array<GroupMetadata>;
};
export type WidgetList = Map<number, Widget>;

export type WidgetCMSState = {
  widgets: WidgetList;
  error: ?Error;
  isLoading: boolean;
};

export type WidgetCMSAction =
  | {
      type: 'FETCH_WIDGET_LIST_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_WIDGET_LIST_SUCCEED';
      widgets: Map<number, Widget>;
    }
  | {
      type: 'FETCH_WIDGET_LIST_REQUESTED';
    }
  | {
      type: 'UPDATE_WIDGET_REQUESTED';
      widget: Widget;
      id: number;
    }
  | {
      type: 'UPDATE_WIDGET_FAILED';
      error: Error;
    }
  | {
      type: 'UPDATE_WIDGET_SUCCEED';
    };
