// @flow

import type {ROLE, TERRITORY_LEVEL} from '../CMS-type';
import type {GroupMetadata} from '../CMS-type';

export type UserMetadata = {
  userLogin: string;
  name: string;
}; // NOTE: userID is userLogin

export type User = {
  userLogin: string;
  name: string;
  position: string;
  userTerritoryLevel: TERRITORY_LEVEL;
  role: ROLE;
  groups: Array<GroupMetadata>;
};

export type UserCMSState = {
  users: Map<string, User>; // NOTE: id is string because using userLogin
  error?: Error;
  isLoading: boolean;
  // NOTE: I add 1 layer of complication so that we can cover more cases later
};

export type UserCMSAction =
  | {
      type: 'UPDATE_USER_REQUESTED';
      user: User;
    }
  | {
      type: 'UPDATE_USER_FAILED';
      error: Error;
    }
  | {
      type: 'UPDATE_USER_SUCCEED';
      newUser: User;
    }
  | {
      type: 'FETCH_USER_LIST_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_USER_LIST_SUCCEED';
      users: Map<string, User>;
    }
  | {
      type: 'FETCH_USER_LIST_REQUESTED';
    }
  | {
      type: 'ASSIGN_MULTIPLE_USER_TO_GROUPS_REQUESTED';
      userIDs: Array<string>;
      groupIDs: Array<number>;
    };
