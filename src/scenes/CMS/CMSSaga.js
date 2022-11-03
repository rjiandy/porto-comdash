// @flow

import {fork, all} from 'redux-saga/effects';

import CMSUserSaga from './Users/UserCMSSaga';
import CMSGroupSaga from './UserGroup/UserGroupCMSSaga';
import CMSNewsFlashSaga from './NewsFlash/saga/newsFlashSaga';
import CMSWidgetSaga from './Widget/saga/widgetSaga';
import CMSHelpLinkSaga from './HelpLink/saga/helpLinkSaga';
import CMSReportSaga from './Report/saga/reportSaga';

export default function* CMSSagaWatcher(): Generator<*, *, *> {
  yield all([
    fork(CMSUserSaga),
    fork(CMSGroupSaga),
    fork(CMSNewsFlashSaga),
    fork(CMSWidgetSaga),
    fork(CMSHelpLinkSaga),
    fork(CMSReportSaga),
  ]);
}

export let authorization = {
  headers: {
    Authorization: 'Basic ' + btoa('dparasat:Password1!'),
  },
}; // TODO: REMOVE this later after using same origin
