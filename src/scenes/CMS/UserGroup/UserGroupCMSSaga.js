// @flow

import {
  takeEvery,
  takeLatest,
  call,
  put,
  select,
  all,
} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* CMSGroupSaga(): Generator<*, *, *> {
  yield takeEvery('FETCH_GROUP_LIST_REQUESTED', CMSGroupGetSaga);
  yield takeEvery('UPDATE_GROUP_REQUESTED', CMSGroupUpdateSaga);
  yield takeLatest('CREATE_GROUP_REQUESTED', CMSGroupAddSaga);
  yield takeEvery('DELETE_GROUP_REQUESTED', CMSGroupDeleteSaga);
}

function* CMSGroupDeleteSaga(action): Generator<*, *, *> {
  try {
    let {groupID} = action;
    let options = {
      method: 'DELETE',
    };
    for (let id of groupID) {
      yield call(fetchJSON, `/Groups/${id}`, options);
    }
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield all([
      put({type: 'FETCH_MY_WIDGETS_REQUESTED'}),
      put({type: 'FETCH_MY_NEWS_FLASHES_REQUESTED'}),
      // TODO: uncomment when these have been implemented
      // put({type: 'FETCH_MY_HELP_LINKS_REQUESTED'}),
      put({type: 'FETCH_MY_REPORTS_REQUESTED'}),
      put({type: 'FETCH_WIDGET_LIST_REQUESTED'}),
      put({type: 'FETCH_REPORT_LIST_REQUESTED'}),
      put({type: 'FETCH_NEWS_FLASH_LIST_REQUESTED'}),
      put({type: 'FETCH_HELP_LINK_LIST_REQUESTED'}),
    ]);
  } catch (error) {
    yield put({type: 'DELETE_GROUP_FAILED', error});
  }
}

function* CMSGroupGetSaga(): Generator<*, *, *> {
  try {
    let groups = yield call(fetchJSON, '/groups', {
      headers: {
        Authorization: 'Basic ' + btoa('tayub:Password1!'),
      },
    });
    let groupList = new Map();
    for (let group of groups) {
      groupList.set(group.id, group);
    }
    yield put({
      type: 'FETCH_GROUPS_LIST_SUCCEED',
      groups: groupList,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_GROUPS_LIST_FAILED',
      error,
    });
  }
}

function* CMSGroupAddSaga(action): Generator<*, *, *> {
  try {
    let {group} = action;
    let {newsFlashes, widgets, users, reportFolders} = group; // TODO add help link
    let {user} = yield select((state) => state.currentUser);
    let headers = {
      'Content-Type': 'application/json',
    };
    let body = JSON.stringify(group);
    yield call(fetchJSON, '/groups', {
      headers,
      method: 'POST',
      body,
    });
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    if (newsFlashes.length > 0) {
      yield put({type: 'FETCH_NEWS_FLASH_LIST_REQUESTED'});
    }
    if (widgets.length > 0) {
      yield put({type: 'FETCH_WIDGET_LIST_REQUESTED'});
    }
    if (reportFolders.length > 0) {
      yield put({type: 'FETCH_REPORT_LIST_REQUESTED'});
    }
    // TODO: Add help links
    if (users.length > 0) {
      if (users.map(({userLogin}) => userLogin).includes(user.userLogin)) {
        yield put({type: 'FETCH_MY_DATA_REQUESTED'});
        if (widgets.length > 0) {
          yield put({type: 'FETCH_MY_WIDGETS_REQUESTED'});
        }
        if (newsFlashes.length > 0) {
          yield put({type: 'FETCH_MY_NEWS_FLASHES_REQUESTED'});
        }
        // TODO: Add Other effects if it touch currentUser
      }
      yield put({type: 'FETCH_USER_LIST_REQUESTED'});
    }
  } catch (error) {
    yield put({
      type: 'CREATE_GROUP_FAILED',
      error,
    });
  }
}

function* CMSGroupUpdateSaga(action): Generator<*, *, *> {
  try {
    let {group} = action;
    let headers = {
      'Content-Type': 'application/json',
    };
    let body = JSON.stringify(group);
    yield call(fetchJSON, `/groups/${group.id}`, {
      headers,
      method: 'PUT',
      body,
    });
    yield all([
      put({type: 'FETCH_MY_WIDGETS_REQUESTED'}),
      put({type: 'FETCH_MY_NEWS_FLASHES_REQUESTED'}),
      // TODO: uncomment when these have been implemented
      // put({type: 'FETCH_MY_HELP_LINKS_REQUESTED'}),
      put({type: 'FETCH_MY_REPORTS_REQUESTED'}),
      put({type: 'FETCH_GROUP_LIST_REQUESTED'}),
      put({type: 'FETCH_WIDGET_LIST_REQUESTED'}),
      put({type: 'FETCH_REPORT_LIST_REQUESTED'}),
      put({type: 'FETCH_NEWS_FLASH_LIST_REQUESTED'}),
      put({type: 'FETCH_HELP_LINK_LIST_REQUESTED'}),
    ]);
  } catch (error) {
    yield put({
      type: 'UPDATE_GROUP_FAILED',
      error,
    });
  }
}
