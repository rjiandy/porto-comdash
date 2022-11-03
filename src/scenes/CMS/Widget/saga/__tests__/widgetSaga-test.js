import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../../general/helpers/fetchJSON';

import watcher, {GetWidgetSaga, UpdateWidgetSaga} from '../widgetSaga';

describe('Widget CMS Saga Test', () => {
  it('Should watch every FETCH_WIDGET_LIST_REQUESTED and UPDATE_WIDGET_REQUESTED', () => {
    let sagaWatcher = watcher();
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('FETCH_WIDGET_LIST_REQUESTED', GetWidgetSaga),
    );
    expect(sagaWatcher.next().value).toEqual(
      takeEvery('UPDATE_WIDGET_REQUESTED', UpdateWidgetSaga),
    );
  });
  it('Should fetch the widget list', () => {
    let result = [{id: 123, name: 'foo'}];
    let widgets = new Map();
    widgets.set(123, result[0]);
    let generator = GetWidgetSaga();
    expect(generator.next().value).toEqual(call(fetchJSON, '/Widgets', {}));
    expect(generator.next(result).value).toEqual(
      put({
        type: 'FETCH_WIDGET_LIST_SUCCEED',
        widgets,
      }),
    );
  });
  it('Should return error if fetch widget list failed', () => {
    let gen = GetWidgetSaga();
    try {
      expect(gen.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'FETCH_WIDGET_LIST_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });

  it('Should edit existing widget', () => {
    let widget = {title: 'foo'};
    let generator = UpdateWidgetSaga({
      type: 'UPDATE_WIDGET_REQUESTED',
      id: 123,
      widget,
    });
    let headers = {
      'Content-Type': 'application/json',
    };
    expect(generator.next().value).toEqual(
      call(fetchJSON, '/Widgets/123', {
        headers,
        method: 'PUT',
        body: JSON.stringify(widget),
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'UPDATE_WIDGET_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_WIDGET_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_GROUP_LIST_REQUESTED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'FETCH_MY_WIDGETS_REQUESTED',
      }),
    );
  });
  it('Should return error if edit widget failed', () => {
    let widget = {title: 'foo'};
    let generator = UpdateWidgetSaga({
      type: 'UPDATE_WIDGET_REQUESTED',
      id: 123,
      widget,
    });
    try {
      expect(generator.throw({message: 'anyErrorMessage'})).toEqual(
        put({
          type: 'UPDATE_WIDGET_FAILED',
          error: {message: 'anyErrorMessage'},
        }),
      );
    } catch (error) {
      expect(error).toEqual({message: 'anyErrorMessage'});
    }
  });
});
