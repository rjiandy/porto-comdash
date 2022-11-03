// @flow

import {call, put, takeEvery} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

import type {ReportCMSAction} from '../Report-type';

export default function* CMSReportSagaWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
    GetReportFolderByIDSaga
  );
  yield takeEvery(
    'FETCH_REPORT_ROOT_FOLDER_REQUESTED',
    GetRootReportFolderSaga
  );
  yield takeEvery('ADD_REPORT_FOLDER_REQUESTED', AddFolderSaga);
  yield takeEvery('ADD_REPORT_FILE_REQUESTED', AddFileSaga);
  yield takeEvery('EDIT_REPORT_FOLDER_REQUESTED', EditFolderSaga);
  yield takeEvery('EDIT_REPORT_FILE_REQUESTED', EditFileSaga);
  // takeEvery('DELETE_REPORT_REQUESTED', DeleteReportSaga),

  // takeEvery('ADD_REPORT_REQUESTED', AddReportSaga),
  // takeEvery('UPDATE_REPORT_REQUESTED', UpdateReportSaga),
  // takeEvery('DELETE_REPORT_REQUESTED', DeleteReportSaga),
  // TODO: move file
}

export function* GetReportFolderByIDSaga(
  action: ReportCMSAction
): Generator<*, *, *> {
  if (action.type !== 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED') {
    return;
  }
  let {folderID} = action;
  try {
    let reportFolder = yield call(fetchJSON, `/ReportFolders/${folderID}`, {});
    yield put({
      type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_SUCCEED',
      reportFolder,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_FAILED',
      error,
    });
  }
}

export function* GetRootReportFolderSaga(
  action: ReportCMSAction
): Generator<*, *, *> {
  if (action.type !== 'FETCH_REPORT_ROOT_FOLDER_REQUESTED') {
    return;
  }
  try {
    let reportFolders = yield call(fetchJSON, `/ReportFolders`, {});
    let reportFolderList = new Map();
    for (let reportFolder of reportFolders) {
      reportFolderList.set(reportFolder.id, reportFolder);
    }

    yield put({
      type: 'FETCH_REPORT_ROOT_FOLDER_SUCCEED',
      reportFolders: reportFolderList,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_REPORT_ROOT_FOLDER_FAILED',
      error,
    });
  }
}

export function* AddFolderSaga(action: ReportCMSAction): Generator<*, *, *> {
  if (action.type !== 'ADD_REPORT_FOLDER_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {reportFolder} = action;
    let body = JSON.stringify(reportFolder);
    yield call(fetchJSON, `/ReportFolders`, {
      headers,
      method: 'POST',
      body,
    });
    yield put({type: 'ADD_REPORT_FOLDER_SUCCEED'});
    if (reportFolder.parentId != null) {
      yield put({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        folderID: reportFolder.parentId,
      });
    } else {
      yield put({type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED'});
    }
    // yield put({type: 'FETCH_REPORT_LIST_REQUESTED'});
    // yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    // yield put({type: 'FETCH_MY_REPORTS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'ADD_REPORT_FOLDER_FAILED',
      error,
    });
  }
}

export function* EditFolderSaga(action: ReportCMSAction): Generator<*, *, *> {
  if (action.type !== 'EDIT_REPORT_FOLDER_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {reportFolder, folderID} = action;
    let body = JSON.stringify(reportFolder);
    yield call(fetchJSON, `/ReportFolders/${folderID}`, {
      headers,
      method: 'PUT',
      body,
    });
    yield put({type: 'EDIT_REPORT_FOLDER_SUCCEED'});
    if (reportFolder.parentId != null) {
      yield put({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        folderID: reportFolder.parentId,
      });
    } else {
      yield put({type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED'});
    }
    // yield put({type: 'FETCH_REPORT_LIST_REQUESTED'});
    // yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    // yield put({type: 'FETCH_MY_REPORTS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'EDIT_REPORT_FOLDER_FAILED',
      error,
    });
  }
}

export function* AddFileSaga(action: ReportCMSAction): Generator<*, *, *> {
  if (action.type !== 'ADD_REPORT_FILE_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {reportFile} = action;
    let body = JSON.stringify(reportFile);
    yield call(fetchJSON, `/ReportFiles`, {
      headers,
      method: 'POST',
      body,
    });
    yield put({type: 'ADD_REPORT_FILES_SUCCEED'});
    if (reportFile.parentId != null) {
      yield put({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        folderID: reportFile.parentId,
      });
    } else {
      yield put({type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED'});
    }
    // yield put({type: 'FETCH_REPORT_LIST_REQUESTED'});
    // yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    // yield put({type: 'FETCH_MY_REPORTS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'ADD_REPORT_FILE_FAILED',
      error,
    });
  }
}

export function* EditFileSaga(action: ReportCMSAction): Generator<*, *, *> {
  if (action.type !== 'EDIT_REPORT_FILE_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {reportFile, fileID} = action;
    let body = JSON.stringify(reportFile);
    yield call(fetchJSON, `/ReportFiles/${fileID}`, {
      headers,
      method: 'PUT',
      body,
    });
    yield put({type: 'EDIT_REPORT_FILE_SUCCEED'});
    if (reportFile.parentId != null) {
      yield put({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        folderID: reportFile.parentId,
      });
    } else {
      yield put({type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED'});
    }
    // yield put({type: 'FETCH_REPORT_LIST_REQUESTED'});
    // yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    // yield put({type: 'FETCH_MY_REPORTS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'EDIT_REPORT_FILE_FAILED',
      error,
    });
  }
}

export function* DeleteReportSaga(action: ReportCMSAction): Generator<*, *, *> {
  if (action.type !== 'DELETE_REPORT_REQUESTED') {
    return;
  }
  try {
    let {folderIDList, fileIDList, activeFolderID} = action;
    for (let id of folderIDList) {
      yield call(fetchJSON, `/ReportFolders/${id}`, {
        method: 'DELETE',
      });
    }

    for (let id of fileIDList) {
      yield call(fetchJSON, `/ReportFiles/${id}`, {
        method: 'DELETE',
      });
    }
    yield put({
      type: 'DELETE_REPORT_SUCCEED',
      folderIDList,
    });
    if (activeFolderID != null) {
      yield put({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        folderID: activeFolderID,
      });
    } else {
      yield put({type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED'});
    }
  } catch (error) {
    yield put({
      type: 'DELETE_REPORT_FAILED',
      error,
    });
  }
}
