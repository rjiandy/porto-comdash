// @flow

import type {GroupMetadata} from '../UserGroup/UserGroup-type';
import type {Creator} from '../CMS-type';

export type ID = number;

export type HelpLink = {
  id: ID;
  name: string;
  linkUrl: string;
  groups: Array<GroupMetadata>;
  creator: Creator;
  createdDate: string;
  lastEdited: string;
};
export type HelpLinkList = Map<number, HelpLink>;

export type HelpLinkCMSState = {
  helpLinks: HelpLinkList;
  error: ?Error;
  isLoading: boolean;
};

export type HelpLinkCMSAction =
  | {
      type: 'FETCH_HELP_LINK_LIST_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_HELP_LINK_LIST_SUCCEED';
      helpLinks: Map<number, HelpLink>;
    }
  | {
      type: 'FETCH_HELP_LINK_LIST_REQUESTED';
    }
  | {
      type: 'ADD_HELP_LINK_REQUESTED';
      helpLink: HelpLink;
    }
  | {
      type: 'ADD_HELP_LINK_FAILED';
      error: Error;
    }
  | {
      type: 'UPDATE_HELP_LINK_REQUESTED';
      helpLink: HelpLink;
      id: number;
    }
  | {
      type: 'UPDATE_HELP_LINK_FAILED';
      error: Error;
    }
  | {
      type: 'UPDATE_HELP_LINK_SUCCEED';
    }
  | {
      type: 'DELETE_HELP_LINK_REQUESTED';
      idList: Array<number>;
    }
  | {
      type: 'DELETE_HELP_LINK_FAILED';
      error: Error;
    }
  | {
      type: 'DELETE_HELP_LINK_SUCCEED';
    };
