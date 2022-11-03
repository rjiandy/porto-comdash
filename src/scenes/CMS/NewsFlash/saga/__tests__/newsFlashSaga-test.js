import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../../general/helpers/fetchJSON';

import watcher, {
  GetNewsFlashSaga,
  AddNewsFlashSaga,
  UpdateNewsFlashSaga,
  DeleteNewsFlashSaga,
} from '../newsFlashSaga';

describe('NewsFlash CMS Saga Test', () => {
  it('Should watch every FETCH_NEWS_FLASH_LIST_REQUESTED, ADD_NEWS_FLASH_REQUESTED, UPDATE_NEWS_FLASH_REQUESTED, and DELETE_NEWS_FLASH_REQUESTED', () => {
    let sagaWatcher = watcher();
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('FETCH_NEWS_FLASH_LIST_REQUESTED', GetNewsFlashSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('ADD_NEWS_FLASH_REQUESTED', AddNewsFlashSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('UPDATE_NEWS_FLASH_REQUESTED', UpdateNewsFlashSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('DELETE_NEWS_FLASH_REQUESTED', DeleteNewsFlashSaga),
    );
  });
  it('Should fetch the news flash list', () => {
    let result = [{id: 123, name: 'foo'}];
    let newsFlashes = new Map();
    newsFlashes.set(123, result[0]);
    let generator = GetNewsFlashSaga();
    expect(generator.next().value).toEqual(call(fetchJSON, '/NewsFlashes', {}));
    expect(generator.next(result).value).toEqual(
      put({
        type: 'FETCH_NEWS_FLASH_LIST_SUCCEED',
        newsFlashes,
      }),
    );
  });
  it('Should return error if fetch news flash list failed', () => {
    let gen = GetNewsFlashSaga();
    try {
      expect(gen.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'FETCH_NEWS_FLASH_LIST_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should add new news flash', () => {
    let newNewsFlash = {name: 'foo'};
    let generator = AddNewsFlashSaga({
      type: 'ADD_NEWS_FLASH_REQUESTED',
      newsFlash: newNewsFlash,
    });
    let headers = {
      'Content-Type': 'application/json',
    };
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/NewsFlashes', {
        headers,
        method: 'POST',
        body: JSON.stringify(newNewsFlash),
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'ADD_NEWS_FLASH_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_NEWS_FLASH_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_GROUP_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_MY_NEWS_FLASHES_REQUESTED',
      }),
    );
  });
  it('Should return error if add news flash failed', () => {
    let newNewsFlash = {name: 'foo'};
    let generator = AddNewsFlashSaga({
      type: 'ADD_NEWS_FLASH_REQUESTED',
      newsFlash: newNewsFlash,
    });
    try {
      expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'ADD_NEWS_FLASH_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should edit existing news flash', () => {
    let newNewsFlash = {name: 'foo'};
    let generator = UpdateNewsFlashSaga({
      type: 'UPDATE_NEWS_FLASH_REQUESTED',
      newsFlash: newNewsFlash,
      id: 123,
    });
    let headers = {
      'Content-Type': 'application/json',
    };
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/NewsFlashes/123', {
        headers,
        method: 'PUT',
        body: JSON.stringify(newNewsFlash),
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'UPDATE_NEWS_FLASH_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_NEWS_FLASH_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_GROUP_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_MY_NEWS_FLASHES_REQUESTED',
      }),
    );
  });
  it('Should return error if edit news flash failed', () => {
    let newNewsFlash = {name: 'foo'};
    let generator = UpdateNewsFlashSaga({
      type: 'UPDATE_NEWS_FLASH_REQUESTED',
      newsFlash: newNewsFlash,
      id: 123,
    });
    try {
      expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'UPDATE_NEWS_FLASH_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should delete existing news flash', () => {
    let idList = [123];
    let generator = DeleteNewsFlashSaga({
      type: 'DELETE_NEWS_FLASH_REQUESTED',
      idList,
    });
    let headers = {};
    for (let id of idList) {
      expect(generator.next().value).toEqual(
        call(fetchJSON, `/NewsFlashes/${id}`, {
          headers,
          method: 'DELETE',
        }),
      );
    }
    expect(generator.next().value).toEqual(
      put({
        type: 'DELETE_NEWS_FLASH_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_NEWS_FLASH_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_GROUP_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_MY_NEWS_FLASHES_REQUESTED',
      }),
    );
  });
  it('Should return error if delete news flash failed', () => {
    let idList = [123];
    let generator = DeleteNewsFlashSaga({
      type: 'DELETE_NEWS_FLASH_REQUESTED',
      idList,
    });
    try {
      expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'DELETE_NEWS_FLASH_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });
});
