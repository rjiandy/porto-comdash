// @flow

import type {ReportCMSState, ReportCMSAction} from '../Report-type';

const initialState = {
  reportFolders: new Map(),
  error: null,
  isLoading: true,
  activeFolder: null,
};

export default function reportCMSReducer(
  state: ReportCMSState = initialState,
  action: ReportCMSAction,
) {
  switch (action.type) {
    case 'ACTIVE_FOLDER_CHANGED': {
      return {
        ...state,
        activeFolder: action.activeFolder,
      };
    }
    case 'FETCH_REPORT_FOLDER_LIST_BY_ID_SUCCEED': {
      let {reportFolders} = state;
      let {reportFolder} = action;

      reportFolders.set(reportFolder.id, reportFolder);

      return {
        ...state,
        reportFolders,
        error: null,
        isLoading: false,
      };
    }

    case 'FETCH_REPORT_ROOT_FOLDER_SUCCEED': {
      let {reportFolders: oldReportFolders} = state;
      let {reportFolders: newReportFolders} = action;
      let reportFolders = new Map([...oldReportFolders, ...newReportFolders]);
      return {
        ...state,
        reportFolders,
        isLoading: false,
        error: null,
      };
    }

    case 'FETCH_REPORT_ROOT_FOLDER_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        activeFolder: null,
      };
    }

    case 'ADD_REPORT_FOLDER_FAILED':
    case 'UPDATE_REPORT_FOLDER_FAILED':
    case 'DELETE_REPORT_FOLDER_FAILED':
    case 'FETCH_REPORT_ROOT_FOLDER_FAILED':
    case 'FETCH_REPORT_FOLDER_LIST_BY_ID_FAILED': {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }
    case 'ADD_REPORT_FOLDER_REQUESTED':
    case 'UPDATE_REPORT_FOLDER_REQUESTED':
    case 'DELETE_REPORT_FOLDER_REQUESTED':
    case 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED': {
      return {
        ...state,
        isLoading: true,
      };
    }

    case 'DELETE_REPORT_FOLDER_SUCCEED': {
      let {folderIDList} = action;
      let {reportFolders} = state;
      let newReportFolders = new Map(reportFolders);
      for (let id of folderIDList) {
        newReportFolders.delete(id);
      }
      return {
        ...state,
        isLoading: false,
        reportFolders: newReportFolders,
      };
    }
    default:
      return state;
  }
}
