// @flow

import type {Action} from '../../../general/stores/Action';
import type {GroupCMSState} from './UserGroup-type';

const initialState = {
  groups: new Map(),
  isLoading: false,
  error: null,
};

export default function groupCMSReducer(
  state: GroupCMSState = initialState,
  action: Action,
): GroupCMSState {
  switch (action.type) {
    case 'DELETE_GROUP_REQUESTED':
    case 'CREATE_GROUP_REQUESTED':
    case 'UPDATE_GROUP_REQUESTED':
    case 'FETCH_GROUP_LIST_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_GROUPS_LIST_SUCCEED': {
      let {groups} = action;
      return {
        groups,
        isLoading: false,
        error: null,
      };
    }
    case 'UPDATE_GROUP_FAILED':
    case 'FETCH_GROUPS_LIST_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    default:
      return state;
  }
}
