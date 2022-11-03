// @flow

import type {HelpLinkCMSState, HelpLinkCMSAction} from '../HelpLink-type';

const initialState = {
  helpLinks: new Map(),
  error: null,
  isLoading: true,
};

export default function helpLinkCMSReducer(
  state: HelpLinkCMSState = initialState,
  action: HelpLinkCMSAction,
) {
  switch (action.type) {
    case 'ADD_HELP_LINK_SUCCEED':
    case 'UPDATE_HELP_LINK_SUCCEED':
    case 'DELETE_HELP_LINK_SUCCEED': {
      return {
        ...state,
        isLoading: false,
      };
    }
    case 'FETCH_HELP_LINK_LIST_SUCCEED': {
      let {helpLinks} = action;
      return {
        ...state,
        helpLinks,
        error: null,
        isLoading: false,
      };
    }
    case 'ADD_HELP_LINK_FAILED':
    case 'UPDATE_HELP_LINK_FAILED':
    case 'DELETE_HELP_LINK_FAILED':
    case 'FETCH_HELP_LINK_LIST_FAILED': {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }
    case 'ADD_HELP_LINK_REQUESTED':
    case 'UPDATE_HELP_LINK_REQUESTED':
    case 'DELETE_HELP_LINK_REQUESTED':
    case 'FETCH_HELP_LINK_LIST_REQUESTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    default:
      return state;
  }
}
