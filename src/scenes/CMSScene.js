// @flow

import React, {Component} from 'react';

import {View, TabBar} from '../general/components/coreUIComponents';

import UserList from './CMS/Users/UserList';
import NewsFlashList from './CMS/NewsFlash/NewsFlashListScene';
import ReportList from './CMS/Report/ReportListScene';
import UserGroupList from './CMS/UserGroup/UserGroupList';
import WidgetList from './CMS/Widget/WidgetListScene';
import HelpLinkList from './CMS/HelpLink/HelpLinkListScene';

import userList from './CMS/fixtures/userList-fixtures';
import userGroupList from './CMS/fixtures/userGroupList-fixtures';

type State = {
  selectedCMSTab: string;
};

class CMSScene extends Component {
  state: State;
  CMSTabs = [
    {tabName: 'Newsflash', iconName: 'newsflash'},
    {tabName: 'Report', iconName: 'file'},
    {tabName: 'Help', iconName: 'help'},
    {tabName: 'Widget', iconName: 'widget'},
    {tabName: ''},
    {tabName: 'Users', iconName: 'user'},
    {tabName: 'Groups', iconName: 'group'},
  ];

  constructor() {
    super(...arguments);
    this.state = {
      selectedCMSTab: 'Newsflash',
    };
  }

  render() {
    let {selectedCMSTab} = this.state;
    return (
      <View style={{flex: 1, padding: 30, paddingVertical: 10}}>
        <TabBar
          tabList={this.CMSTabs}
          selectedTabName={selectedCMSTab}
          onChangeTab={(newTabName) => this._changeCMSTab(newTabName)}
        />
        <View style={{flex: 1, marginTop: 10}}>
          {this._renderSelectedTab()}
        </View>
      </View>
    );
  }

  _renderSelectedTab() {
    let {selectedCMSTab} = this.state;
    switch (selectedCMSTab) {
      case 'Newsflash':
        return <NewsFlashList />;
      case 'Report':
        return <ReportList />;
      case 'Users':
        return <UserList userList={userList} userGroupList={userGroupList} />;
      case 'Groups':
        return <UserGroupList />;
      case 'Help':
        return <HelpLinkList />;
      case 'Widget':
        return <WidgetList />;
      default:
        break;
    }
  }

  _changeCMSTab(newTabName: string) {
    this.setState({selectedCMSTab: newTabName});
  }
}

// TODO: Enable the AnimatedWrapper a different way so it doesn't break flex.
// export default AnimatedWrapper(CMSScene);
export default CMSScene;
