import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../../general/helpers/fetchJSON';

import watcher, {
  GetHelpLinkSaga,
  AddHelpLinkSaga,
  UpdateHelpLinkSaga,
  DeleteHelpLinkSaga,
} from '../helpLinkSaga';

describe('HelpLink CMS Saga Test', () => {
  it('Should watch every FETCH_HELP_LINK_LIST_REQUESTED, ADD_HELP_LINK_REQUESTED, UPDATE_HELP_LINK_REQUESTED, and DELETE_HELP_LINK_REQUESTED', () => {
    let sagaWatcher = watcher();
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('FETCH_HELP_LINK_LIST_REQUESTED', GetHelpLinkSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('ADD_HELP_LINK_REQUESTED', AddHelpLinkSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('UPDATE_HELP_LINK_REQUESTED', UpdateHelpLinkSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('DELETE_HELP_LINK_REQUESTED', DeleteHelpLinkSaga),
    );
  });
  it('Should fetch the help link list', () => {
    let result = [{id: 123, name: 'foo'}];
    let helpLinks = new Map();
    helpLinks.set(123, result[0]);
    let generator = GetHelpLinkSaga();
    expect(generator.next().value).toEqual(call(fetchJSON, '/HelpLinks', {}));
    expect(generator.next(result).value).toEqual(
      put({
        type: 'FETCH_HELP_LINK_LIST_SUCCEED',
        helpLinks,
      }),
    );
  });
  it('Should return error if fetch help link list failed', () => {
    let gen = GetHelpLinkSaga();
    try {
      expect(gen.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'FETCH_HELP_LINK_LIST_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should add new help link', () => {
    let newHelpLink = {name: 'foo'};
    let generator = AddHelpLinkSaga({
      type: 'ADD_HELP_LINK_REQUESTED',
      helpLink: newHelpLink,
    });
    let headers = {
      'Content-Type': 'application/json',
    };
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/HelpLinks', {
        headers,
        method: 'POST',
        body: JSON.stringify(newHelpLink),
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'ADD_HELP_LINK_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_HELP_LINK_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_GROUP_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_MY_HELP_LINKS_REQUESTED',
      }),
    );
  });
  it('Should return error if add help link failed', () => {
    let newHelpLink = {name: 'foo'};
    let generator = AddHelpLinkSaga({
      type: 'ADD_HELP_LINK_REQUESTED',
      helpLink: newHelpLink,
    });
    try {
      expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'ADD_HELP_LINK_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should edit existing help link', () => {
    let newHelpLink = {name: 'foo'};
    let generator = UpdateHelpLinkSaga({
      type: 'UPDATE_HELP_LINK_REQUESTED',
      helpLink: newHelpLink,
      id: 123,
    });
    let headers = {
      'Content-Type': 'application/json',
    };
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/HelpLinks/123', {
        headers,
        method: 'PUT',
        body: JSON.stringify(newHelpLink),
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'UPDATE_HELP_LINK_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_HELP_LINK_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_GROUP_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_MY_HELP_LINKS_REQUESTED',
      }),
    );
  });
  it('Should return error if edit help link failed', () => {
    let newHelpLink = {name: 'foo'};
    let generator = UpdateHelpLinkSaga({
      type: 'UPDATE_HELP_LINK_REQUESTED',
      helpLink: newHelpLink,
      id: 123,
    });
    try {
      expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'UPDATE_HELP_LINK_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should delete existing help link', () => {
    let idList = [123];
    let generator = DeleteHelpLinkSaga({
      type: 'DELETE_HELP_LINK_REQUESTED',
      idList,
    });
    let headers = {};
    for (let id of idList) {
      expect(generator.next().value).toEqual(
        call(fetchJSON, `/HelpLinks/${id}`, {
          headers,
          method: 'DELETE',
        }),
      );
    }
    expect(generator.next().value).toEqual(
      put({
        type: 'DELETE_HELP_LINK_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_HELP_LINK_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_GROUP_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_MY_HELP_LINKS_REQUESTED',
      }),
    );
  });
  it('Should return error if delete help link failed', () => {
    let idList = [123];
    let generator = DeleteHelpLinkSaga({
      type: 'DELETE_HELP_LINK_REQUESTED',
      idList,
    });
    try {
      expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'DELETE_HELP_LINK_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });
});
