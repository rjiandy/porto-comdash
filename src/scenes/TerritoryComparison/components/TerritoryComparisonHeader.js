// @flow
import React from 'react';
import {StyleSheet} from 'react-primitives';
import {
  View,
  TabBar,
} from '../../../general/components/coreUIComponents';

type NavigationProps = {
  selectedViewMode: string;
  tabList: Array<string>;
  onChangeViewMode: (newTab: string) => void;
};

function TerritoryComparisonHeader(props: NavigationProps) {
  let {
    selectedViewMode,
    tabList,
    onChangeViewMode,
  } = props;

  let formatedTabList = tabList.map((tabName) => {
    return {
      tabName,
    };
  });

  return (
    <View style={styles.filterContent}>
      <View style={styles.filterContentView}>
        <TabBar
          selectedTabName={selectedViewMode}
          tabList={formatedTabList}
          onChangeTab={onChangeViewMode}
        />
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  filterContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterContentView: {
    paddingBottom: 20,
  },
});

export default TerritoryComparisonHeader;
