// @flow

import {call, put, takeEvery} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

import type {HelpLinkCMSAction} from '../HelpLink-type';

export default function* CMSHelpLinkSagaWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_HELP_LINK_LIST_REQUESTED', GetHelpLinkSaga);
  yield takeEvery('ADD_HELP_LINK_REQUESTED', AddHelpLinkSaga);
  yield takeEvery('UPDATE_HELP_LINK_REQUESTED', UpdateHelpLinkSaga);
  yield takeEvery('DELETE_HELP_LINK_REQUESTED', DeleteHelpLinkSaga);
}

export function* GetHelpLinkSaga(): Generator<*, *, *> {
  try {
    let helpLinks = yield call(fetchJSON, '/HelpLinks', {});
    let helpLinkList = new Map();
    for (let helpLink of helpLinks) {
      helpLinkList.set(helpLink.id, helpLink);
    }
    yield put({
      type: 'FETCH_HELP_LINK_LIST_SUCCEED',
      helpLinks: helpLinkList,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_HELP_LINK_LIST_FAILED',
      error,
    });
  }
}

export function* AddHelpLinkSaga(
  action: HelpLinkCMSAction
): Generator<*, *, *> {
  if (action.type !== 'ADD_HELP_LINK_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {helpLink} = action;
    let body = JSON.stringify(helpLink);
    yield call(fetchJSON, `/HelpLinks`, {
      headers,
      method: 'POST',
      body,
    });
    yield put({type: 'ADD_HELP_LINK_SUCCEED'});
    yield put({type: 'FETCH_HELP_LINK_LIST_REQUESTED'});
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield put({type: 'FETCH_MY_HELP_LINKS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'ADD_HELP_LINK_FAILED',
      error,
    });
  }
}

export function* UpdateHelpLinkSaga(
  action: HelpLinkCMSAction
): Generator<*, *, *> {
  if (action.type !== 'UPDATE_HELP_LINK_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {helpLink, id} = action;
    let body = JSON.stringify(helpLink);
    yield call(fetchJSON, `/HelpLinks/${id}`, {
      headers,
      method: 'PUT',
      body,
    });
    yield put({type: 'UPDATE_HELP_LINK_SUCCEED'});
    yield put({type: 'FETCH_HELP_LINK_LIST_REQUESTED'});
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield put({type: 'FETCH_MY_HELP_LINKS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'UPDATE_HELP_LINK_FAILED',
      error,
    });
  }
}

export function* DeleteHelpLinkSaga(
  action: HelpLinkCMSAction
): Generator<*, *, *> {
  if (action.type !== 'DELETE_HELP_LINK_REQUESTED') {
    return;
  }
  try {
    let headers = {};
    let {idList} = action;
    for (let id of idList) {
      yield call(fetchJSON, `/HelpLinks/${id}`, {
        headers,
        method: 'DELETE',
      });
    }
    yield put({type: 'DELETE_HELP_LINK_SUCCEED'});
    yield put({type: 'FETCH_HELP_LINK_LIST_REQUESTED'});
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield put({type: 'FETCH_MY_HELP_LINKS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'DELETE_HELP_LINK_FAILED',
      error,
    });
  }
}
