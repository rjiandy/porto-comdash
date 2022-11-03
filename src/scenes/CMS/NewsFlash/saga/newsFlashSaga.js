// @flow

import {call, put, takeEvery} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

import type {NewsFlashCMSAction} from '../NewsFlash-type';

export default function* CMSNewsFlashSagaWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_NEWS_FLASH_LIST_REQUESTED', GetNewsFlashSaga);
  yield takeEvery('ADD_NEWS_FLASH_REQUESTED', AddNewsFlashSaga);
  yield takeEvery('UPDATE_NEWS_FLASH_REQUESTED', UpdateNewsFlashSaga);
  yield takeEvery('DELETE_NEWS_FLASH_REQUESTED', DeleteNewsFlashSaga);
}

export function* GetNewsFlashSaga(): Generator<*, *, *> {
  try {
    let newsFlashes = yield call(fetchJSON, '/NewsFlashes', {});
    let newsFlashList = new Map();
    for (let newsFlash of newsFlashes) {
      newsFlashList.set(newsFlash.id, newsFlash);
    }
    yield put({
      type: 'FETCH_NEWS_FLASH_LIST_SUCCEED',
      newsFlashes: newsFlashList,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_NEWS_FLASH_LIST_FAILED',
      error,
    });
  }
}

export function* AddNewsFlashSaga(
  action: NewsFlashCMSAction
): Generator<*, *, *> {
  if (action.type !== 'ADD_NEWS_FLASH_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {newsFlash} = action;
    let body = JSON.stringify(newsFlash);
    yield call(fetchJSON, `/NewsFlashes`, {
      headers,
      method: 'POST',
      body,
    });
    yield put({type: 'ADD_NEWS_FLASH_SUCCEED'});
    yield put({type: 'FETCH_NEWS_FLASH_LIST_REQUESTED'});
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield put({type: 'FETCH_MY_NEWS_FLASHES_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'ADD_NEWS_FLASH_FAILED',
      error,
    });
  }
}

export function* UpdateNewsFlashSaga(
  action: NewsFlashCMSAction
): Generator<*, *, *> {
  if (action.type !== 'UPDATE_NEWS_FLASH_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {newsFlash, id} = action;
    let body = JSON.stringify(newsFlash);
    yield call(fetchJSON, `/NewsFlashes/${id}`, {
      headers,
      method: 'PUT',
      body,
    });
    yield put({type: 'UPDATE_NEWS_FLASH_SUCCEED'});
    yield put({type: 'FETCH_NEWS_FLASH_LIST_REQUESTED'});
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield put({type: 'FETCH_MY_NEWS_FLASHES_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'UPDATE_NEWS_FLASH_FAILED',
      error,
    });
  }
}

export function* DeleteNewsFlashSaga(
  action: NewsFlashCMSAction
): Generator<*, *, *> {
  if (action.type !== 'DELETE_NEWS_FLASH_REQUESTED') {
    return;
  }
  try {
    let headers = {};
    let {idList} = action;
    for (let id of idList) {
      yield call(fetchJSON, `/NewsFlashes/${id}`, {
        headers,
        method: 'DELETE',
      });
    }
    yield put({type: 'DELETE_NEWS_FLASH_SUCCEED'});
    yield put({type: 'FETCH_NEWS_FLASH_LIST_REQUESTED'});
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield put({type: 'FETCH_MY_NEWS_FLASHES_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'DELETE_NEWS_FLASH_FAILED',
      error,
    });
  }
}
