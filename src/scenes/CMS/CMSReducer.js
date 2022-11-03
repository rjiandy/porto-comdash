// @flow

import {combineReducers} from 'redux';

import userCMSReducer from './Users/userCMSReducer';
import groupCMSReducer from './UserGroup/UserGroupCMSReducer';
import newsFlashCMSReducer from './NewsFlash/reducer/newsflashReducer';
import widgetCMSReducer from './Widget/reducer/widgetReducer';
import helpLinkCMSReducer from './HelpLink/reducer/helpLinkReducer';
import reportCMSReducer from './Report/reducer/reportReducer';

export default combineReducers({
  userCMS: userCMSReducer,
  groupCMS: groupCMSReducer,
  widgetCMS: widgetCMSReducer,
  reportCMS: reportCMSReducer,
  helpLinkCMS: helpLinkCMSReducer,
  newsFlashCMS: newsFlashCMSReducer,
});
