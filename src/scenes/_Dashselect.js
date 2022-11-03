// @flow
import React, {Component} from 'react';
import autobind from 'class-autobind';

import {
  View,
  Text,
  TabBar,
  Dropdown,
} from '../general/components/coreUIComponents';
import {colorStyles} from '../general/constants/colors';

type State = {
  selectedDashboardTab: string;
};

const dashboardTabs = [
  {
    tabName: 'Brand',
    // iconName: 'brand',
  },
  {
    tabName: 'Territory',
    // iconName: 'territory',
  },
  {
    tabName: 'Channel',
    // iconName: 'channel',
  },
];

class Dashselect extends Component {
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedDashboardTab: 'Brand', // Change this to the first available tab
    };
  }

  render() {
    let {selectedDashboardTab} = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 15,
          marginRight: 40,
          alignItems: 'center',
        }}
      >
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text customStyle="header">Dashboard</Text>
          <View style={{paddingLeft: 20}}>
            <TabBar
              tabList={dashboardTabs}
              selectedTabName={selectedDashboardTab}
              onChangeTab={(newTabName) => this._changeTab(newTabName)}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 4}}>
          <Dropdown
            options={[
              'Indonesia',
              'Jawa Barat',
              'Sumatra',
              'Kalimantan',
              'Ambon',
            ]}
            label="Territory"
            containerStyle={[colorStyles.thickShadow, {margin: 8}]}
          />
          <Dropdown
            options={['Sampoerna', 'U Mild', 'DSS Kretek']}
            label="Brand"
            containerStyle={[colorStyles.thickShadow, {margin: 8}]}
          />
          <Dropdown
            options={['AMD 12', 'SKT 32', 'UML 21']}
            label="Product"
            containerStyle={[colorStyles.thickShadow, {margin: 8}]}
          />
        </View>
      </View>
    );
  }

  _changeTab(newTabName: string) {
    this.setState({selectedDashboardTab: newTabName});
  }
}

export default Dashselect;
