// @flow

import type {Action} from '../../../general/stores/Action';
import type {CommunityState} from '../types/Community-type';

let initialState = {
  data: {
    achievements: [],
    programs: [],
  },
  isLoading: false,
  error: null,
};

export default function brandProductImageryReducer(
  state: CommunityState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_COMMUNITY_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_COMMUNITY_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_COMMUNITY_SUCCEED': {
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
