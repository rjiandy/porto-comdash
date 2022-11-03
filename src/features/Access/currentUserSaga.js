// @flow

import {takeEvery, call, put, all} from 'redux-saga/effects';
import {delay} from 'redux-saga';

import {fetchStagingAPI as fetchJSON} from '../../general/helpers/fetchJSON';

import type {UserAccessAction} from '../Access/CurrentUser-type';

export default function* userAuthorizationWatcherSaga(
  action: any,
): Generator<*, *, *> {
  yield takeEvery('AUTHORIZATION_REQUESTED', authorizationSaga);
  yield takeEvery('FETCH_MY_DATA_REQUESTED', myDataSaga);
  yield takeEvery('FETCH_MY_WIDGETS_REQUESTED', myWidgetsSaga);
  yield takeEvery('FETCH_MY_NEWS_FLASHES_REQUESTED', myNewsFlashesSaga);
  yield takeEvery(
    'UPDATE_MY_UNREAD_NEWS_FLASHES_REQUESTED',
    updateUnreadNewsflashes,
  );
  yield takeEvery('FETCH_MY_REPORTS_REQUESTED', myReportsSaga);
  yield takeEvery(
    'FETCH_MY_REPORTS_FOLDER_BY_ID_REQUESTED',
    myReportFolderByIDSaga,
  );
}

export function* newsFlashSyncSaga(): Generator<*, *, *> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    yield call(delay, 5 * 60 * 1000);
    yield put({type: 'FETCH_MY_NEWS_FLASHES_REQUESTED'});
  }
}

export function* authorizationSaga(): Generator<*, *, *> {
  try {
    let [
      user,
      widgets,
      newsFlashes,
      unreadNewsFlashes,
      brandFamilies,
      helpLinks,
    ] = [
      yield call(fetchJSON, '/me', {}),
      yield call(fetchJSON, '/me/widgets', {}),
      yield call(fetchJSON, '/me/newsFlashes', {}),
      yield call(fetchJSON, '/me/newsflashes/unread', {}),
      yield call(fetchJSON, '/me/brandfamilymasters', {}),
      yield call(fetchJSON, '/me/helplinks', {}),
    ];
    let userGroup = user.groups.map(({id, groupName, createdBy}) => ({
      id,
      groupName,
      createdBy,
    }));
    let unreadNewsFlashesIDs = unreadNewsFlashes.map(({id}) => id);
    let newsFlashesList = newsFlashes.map(
      (news) =>
        unreadNewsFlashesIDs.includes(news.id)
          ? {...news, hasRead: false}
          : {...news, hasRead: true},
    );
    let sortById = (a, b) => a.id - b.id;
    let userData = {
      ...user,
      territories: user.territories.sort(sortById),
      brandFamily: brandFamilies.sort(sortById),
      groups: userGroup,
      widgets: widgets.map(({id, widgetName}) => ({id, widgetName})),
      newsFlashes: newsFlashesList,
      helpLinks,
    };
    if (userData.role !== 'USER') {
      yield all([
        put({type: 'FETCH_USER_LIST_REQUESTED'}),
        put({type: 'FETCH_GROUP_LIST_REQUESTED'}),
        put({type: 'FETCH_NEWS_FLASH_LIST_REQUESTED'}),
        put({type: 'FETCH_WIDGET_LIST_REQUESTED'}),
        put({type: 'FETCH_REPORT_LIST_REQUESTED'}),
        put({type: 'FETCH_HELP_LINK_LIST_REQUESTED'}),
      ]);
    }
    yield put({
      type: 'AUTHORIZATION_SUCCEED',
      userData,
    });
  } catch (error) {
    yield put({
      type: 'AUTHORIZATION_FAILED',
      error,
    });
  }
}
export function* myDataSaga(): Generator<*, *, *> {
  try {
    let [user, brandFamilies] = yield all([
      call(fetchJSON, '/me', {}),
      call(fetchJSON, '/me/brandfamilymasters', {}),
    ]);
    let userData = {
      ...user,
      brandFamily: brandFamilies,
    };
    yield put({type: 'FETCH_MY_DATA_SUCCEED', userData});
  } catch (error) {
    yield put({type: 'FETCH_MY_DATA_FAILED', error});
  }
}

export function* myWidgetsSaga(): Generator<*, *, *> {
  try {
    let widgets = yield call(fetchJSON, '/me/widgets', {});
    yield put({type: 'FETCH_MY_WIDGETS_SUCCEED', widgets});
  } catch (error) {
    yield put({type: 'FETCH_MY_WIDGETS_FAILED', error});
  }
}

export function* myNewsFlashesSaga(): Generator<*, *, *> {
  try {
    let newsFlashList = yield call(fetchJSON, '/me/newsFlashes', {});
    let unreadNewsflashes = yield call(fetchJSON, '/me/newsFlashes/unread', {});
    let unreadList = unreadNewsflashes.map(({id}) => id);
    let newsFlashes = newsFlashList.map(
      (news) =>
        unreadList.includes(news.id)
          ? {...news, hasRead: false}
          : {...news, hasRead: true},
    );
    yield put({type: 'FETCH_MY_NEWS_FLASHES_SUCCEED', newsFlashes});
  } catch (error) {
    yield put({type: 'FETCH_MY_NEWS_FLASHES_FAILED'});
  }
}

export function* updateUnreadNewsflashes(action: {
  id: string;
}): Generator<*, *, *> {
  try {
    yield call(fetchJSON, `/me/newsflashes/read/${action.id}`, {
      method: 'PUT',
    });
    yield call(myNewsFlashesSaga);
  } catch (error) {
    yield put({type: 'FETCH_MY_UNREAD_NEWS_FLASHES_FAILED'});
  }
}
export function* myReportsSaga(): Generator<*, *, *> {
  try {
    let folders = yield call(fetchJSON, '/me/reportFolders', {});
    let files = yield call(fetchJSON, '/me/reportfiles', {});
    let searchableFiles = yield call(
      fetchJSON,
      '/me/reportfiles/searchable',
      {},
    );

    let reportFolders = new Map();
    let reportFiles = new Map();
    for (let folder of folders) {
      reportFolders.set(folder.id, folder);
    }
    for (let file of files) {
      reportFiles.set(file.id, file);
    }

    yield put({
      type: 'FETCH_MY_REPORTS_SUCCEED',
      reportFolders,
      reportFiles,
      searchableFiles,
    });
  } catch (error) {
    yield put({type: 'FETCH_MY_REPORTS_FAILED'});
  }
}

export function* myReportFolderByIDSaga(
  action: UserAccessAction,
): Generator<*, *, *> {
  if (action.type !== 'FETCH_MY_REPORTS_FOLDER_BY_ID_REQUESTED') {
    return;
  }
  try {
    let {folderID} = action;
    let reportFolder = yield call(fetchJSON, `/ReportFolders/${folderID}`, {}); // TODO: confirm url with Alfi

    yield put({type: 'FETCH_MY_REPORTS_FOLDER_BY_ID_SUCCEED', reportFolder});
  } catch (error) {
    yield put({type: 'FETCH_MY_REPORTS_FOLDER_BY_ID_FAILED'});
  }
}
