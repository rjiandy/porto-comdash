// @flow

import type {Action} from '../../general/stores/Action';
import type {UserState} from './CurrentUser-type';

export default function currentUserReducer(
  state: UserState = {user: null, isLoading: false},
  action: Action,
) {
  switch (action.type) {
    case 'AUTHORIZATION_REQUESTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'AUTHORIZATION_SUCCEED': {
      let {userData} = action;
      return {
        ...state,
        user: {
          ...state.user,
          ...userData,
        },
        isLoading: false,
      };
    }
    case 'AUTHORIZATION_FAILED': {
      return {
        ...state,
        isLoading: false,
      };
    }
    case 'FETCH_MY_DATA_SUCCEED': {
      let {userData} = action;
      if (state.user) {
        let {widgets, groups, newsFlashes} = state.user;
        return {
          ...state,
          user: {
            ...userData,
            widgets,
            groups,
            newsFlashes,
          },
        };
      }
      return {
        ...state,
        user: userData,
      };
    }
    case 'FETCH_MY_WIDGETS_SUCCEED': {
      let {widgets} = action;
      return {
        ...state,
        user: {
          ...state.user,
          widgets,
        },
      };
    }
    case 'FETCH_MY_NEWS_FLASHES_SUCCEED': {
      let {newsFlashes} = action;
      return {
        ...state,
        user: {
          ...state.user,
          newsFlashes,
        },
      };
    }
    case 'FETCH_MY_UNREAD_NEWS_FLASHES_SUCCEED': {
      let {unreadNewsFlashes} = action;
      return {
        ...state,
        user: {
          ...state.user,
          unreadNewsFlashes,
        },
      };
    }
    case 'FETCH_MY_REPORTS_SUCCEED': {
      let {reportFolders, reportFiles, searchableFiles} = action;
      return {
        ...state,
        user: {
          ...state.user,
          reports: {
            reportFolders,
            reportFiles,
            searchableFiles,
            isLoading: false,
            activeFolder: null,
          },
        },
      };
    }
    case 'FETCH_MY_REPORTS_REQUESTED':
    case 'FETCH_MY_REPORTS_FOLDER_BY_ID_REQUESTED': {
      let {user} = state;
      let reports = {};
      if (user == null) {
        return state;
      } else {
        ({reports} = user);
      }
      return {
        ...state,
        user: {
          ...user,
          reports: {
            ...reports,
            isLoading: true,
          },
        },
      };
    }
    case 'MY_REPORT_ACTIVE_FOLDER_CHANGED': {
      let {user} = state;
      let reports = {};
      if (user) {
        ({reports} = user);
      }
      return {
        ...state,
        user: {
          ...user,
          reports: {
            ...reports,
            activeFolder: action.activeFolder,
          },
        },
      };
    }
    case 'FETCH_MY_REPORTS_FOLDER_BY_ID_SUCCEED': {
      let {user} = state;
      let reports = {};
      if (user) {
        ({reports} = user);
        let {reportFolder} = action;

        reports.reportFolders.set(reportFolder.id, reportFolder);
      }
      return {
        ...state,
        user: {
          ...user,
          reports: {
            ...reports,
            isLoading: false,
          },
        },
      };
    }
    default:
      return state;
  }
}
