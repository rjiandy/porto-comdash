// @flow

import React from 'react';
import {StyleSheet, Touchable} from 'react-primitives';
import {View, Text, Icon} from '../coreUIComponents';
import {
  PALE_GREY,
  MEDIUM_GREY,
  DARK_GREY,
  BACKGROUND,
} from '../../constants/colors';

type Props = {
  selectedTabName: string;
  tabList: Array<| string
    | {
      tabName: string;
      iconName?: string;
    }>;
  onChangeTab: (newTabName: string) => void;
};

export default function TabBar(props: Props) {
  let {selectedTabName, tabList, onChangeTab} = props;
  return (
    <View style={styles.tabBarContainer}>
      {tabList.map((tab, index) => {
        let tabName;
        let iconName;
        if (typeof tab === 'string') {
          tabName = tab;
        } else {
          tabName = tab.tabName;
          iconName = tab.iconName;
        }
        let isActive = tabName === selectedTabName;
        return tabName === ''
          ? <View style={styles.tabBarGap}>
              <View style={styles.leftEnd} />
              <View style={styles.rightEnd} />
            </View>
          : <Tab
              key={index}
              iconName={iconName}
              tabName={tabName}
              isActive={isActive}
              onChangeTab={onChangeTab}
            />;
      })}
    </View>
  );
}

type TabProps = {
  iconName?: string;
  tabName: string;
  isActive: boolean;
  onChangeTab: (newTabName: string) => void;
};

export function Tab(props: TabProps) {
  let {tabName, iconName, isActive, onChangeTab} = props;

  return (
    <Touchable onPress={() => onChangeTab(tabName)}>
      <View style={styles.tabContainer}>
        {iconName
          ? <Icon
              name={iconName}
              color={isActive ? 'blue' : 'grey'}
              style={{marginRight: 10}}
            />
          : null}
        <Text
          style={isActive ? styles.activeTabText : styles.tabText}
          fontWeight={isActive ? 'bold' : 'light'}
        >
          {tabName}
        </Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    backgroundColor: PALE_GREY,
    borderRadius: 4,
    paddingVertical: 3,
    paddingLeft: 8,
    paddingRight: 3,
    // borderWidth: 1,
    // flex: 1,
    // borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 18,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    alignItems: 'center',
    marginRight: 6,
  },
  tabIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  tabText: {
    color: MEDIUM_GREY,
  },
  activaTabText: {
    color: DARK_GREY,
    fontWeight: '800',
  },
  tabBarGap: {
    width: 30,
    backgroundColor: BACKGROUND,
    marginVertical: -3,
    marginRight: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftEnd: {
    backgroundColor: PALE_GREY,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    width: 3,
  },
  rightEnd: {
    backgroundColor: PALE_GREY,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    width: 3,
  },
});
