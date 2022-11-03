// @flow

import type {
  ROLE,
  ReportFolder,
  UserMetadata,
  Widget,
  NewsFlashMetadata,
} from '../CMS-type';

export type Group = {
  id: number;
  groupName: string;
  createdBy: ROLE;
  users: Array<UserMetadata>;
  widgets: Array<Widget>;
  newsFlashes: Array<NewsFlashMetadata>;
  reportFolders: Array<ReportFolder>;
};

export type GroupMetadata = {
  id: number;
  groupName: string;
};

export type GroupCMSState = {
  groups: Map<number, Group>;
  isLoading: boolean;
  error: ?Error;
};

export type GroupCMSAction =
  | {
      type: 'FETCH_GROUPS_LIST_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_GROUPS_LIST_SUCCEED';
      groups: Map<number, Group>;
    }
  | {
      type: 'FETCH_GROUP_LIST_REQUESTED';
    }
  | {
      type: 'CREATE_GROUP_FAILED';
      error: Error;
    }
  | {
      type: 'CREATE_GROUP_SUCCEED';
      group: Group;
    }
  | {
      type: 'CREATE_GROUP_REQUESTED';
      group: Group;
    }
  | {
      type: 'UPDATE_GROUP_FAILED';
      error: Error;
    }
  | {
      type: 'UPDATE_GROUP_SUCCEED';
      group: Group;
    }
  | {
      type: 'UPDATE_GROUP_REQUESTED';
      group: Group;
    }
  | {
      type: 'DELETE_GROUP_FAILED';
      error: Error;
    }
  | {
      type: 'DELETE_GROUP_SUCCEED';
    }
  | {
      type: 'DELETE_GROUP_REQUESTED';
      groupID: number | Array<number>;
    };
