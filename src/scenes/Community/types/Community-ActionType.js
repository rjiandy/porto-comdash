// @flow
import type {Community} from './Community-type';

export type CommunityAction =
  | {
      type: 'FETCH_COMMUNITY_REQUESTED';
    }
  | {
      type: 'FETCH_COMMUNITY_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_COMUUNITY_SUCCEED';
      data: Community;
    };
