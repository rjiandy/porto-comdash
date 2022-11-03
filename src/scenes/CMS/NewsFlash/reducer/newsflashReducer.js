// @flow

import type {NewsFlashCMSState, NewsFlashCMSAction} from '../NewsFlash-type';

const initialState = {
  newsFlashes: new Map(),
  error: null,
  isLoading: true,
};

export default function newsFlashCMSReducer(
  state: NewsFlashCMSState = initialState,
  action: NewsFlashCMSAction,
) {
  switch (action.type) {
    case 'FETCH_NEWS_FLASH_LIST_SUCCEED': {
      let {newsFlashes} = action;
      return {
        ...state,
        newsFlashes,
        error: null,
        isLoading: false,
      };
    }
    case 'ADD_NEWS_FLASH_FAILED':
    case 'UPDATE_NEWS_FLASH_FAILED':
    case 'DELETE_NEWS_FLASH_FAILED':
    case 'FETCH_NEWS_FLASH_LIST_FAILED': {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }
    case 'ADD_NEWS_FLASH_REQUESTED':
    case 'UPDATE_NEWS_FLASH_REQUESTED':
    case 'DELETE_NEWS_FLASH_REQUESTED':
    case 'FETCH_NEWS_FLASH_LIST_REQUESTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    default:
      return state;
  }
}
