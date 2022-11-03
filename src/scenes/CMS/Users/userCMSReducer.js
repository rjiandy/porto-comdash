// @flow

import type {UserCMSState} from './User-type';
import type {Action} from '../../../general/stores/Action';

export default function userCMSReducer(
  state: UserCMSState = {users: new Map(), isLoading: true},
  action: Action,
): UserCMSState {
  switch (action.type) {
    case 'ASSIGN_MULTIPLE_USER_TO_GROUPS_REQUESTED':
    case 'UPDATE_USER_REQUESTED':
    case 'FETCH_USER_LIST_REQUESTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_USER_LIST_SUCCEED': {
      let {users} = action;
      return {
        users,
        isLoading: false,
      };
    }
    case 'ASSIGN_MULTIPLE_USER_TO_GROUPS_FAILED':
    case 'UPDATE_USER_FAILED':
    case 'FETCH_USER_LIST_FAILED': {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
