// @flow

import {call, put, takeEvery} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

import type {WidgetCMSAction} from '../Widget-type';

export default function* CMSWidgetSagaWatcher(): Generator<*, *, *> {
  yield takeEvery('FETCH_WIDGET_LIST_REQUESTED', GetWidgetSaga);
  yield takeEvery('UPDATE_WIDGET_REQUESTED', UpdateWidgetSaga);
}

export function* GetWidgetSaga(): Generator<*, *, *> {
  try {
    let widgets = yield call(fetchJSON, '/Widgets', {});
    let widgetList = new Map();
    for (let widget of widgets) {
      widgetList.set(widget.id, widget);
    }
    yield put({
      type: 'FETCH_WIDGET_LIST_SUCCEED',
      widgets: widgetList,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_WIDGET_LIST_FAILED',
      error,
    });
  }
}

export function* UpdateWidgetSaga(action: WidgetCMSAction): Generator<*, *, *> {
  if (action.type !== 'UPDATE_WIDGET_REQUESTED') {
    return;
  }
  try {
    let headers = {
      'Content-Type': 'application/json',
    };
    let {widget, id} = action;
    let body = JSON.stringify(widget);
    yield call(fetchJSON, `/Widgets/${id}`, {
      headers,
      method: 'PUT',
      body,
    });
    yield put({type: 'UPDATE_WIDGET_SUCCEED'});
    yield put({type: 'FETCH_WIDGET_LIST_REQUESTED'});
    yield put({type: 'FETCH_GROUP_LIST_REQUESTED'});
    yield put({type: 'FETCH_MY_WIDGETS_REQUESTED'});
  } catch (error) {
    yield put({
      type: 'UPDATE_WIDGET_FAILED',
      error,
    });
  }
}
