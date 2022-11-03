// @flow

import React, {Component} from 'react';
import {StyleSheet, Touchable, Image} from 'react-primitives';
import {View, Text, MaterialIcon} from './coreUIComponents';
import {THEME_COLOR, colorStyles} from '../constants/colors';
import BlueFile from '../../assets/images/file-blue.svg';
import WhiteFile from '../../assets/images/file-white.svg';

export type SideBarCategory = 'report' | 'widget';

type Props = {
  isSidebarOpened: boolean;
  currentSideBar: SideBarCategory;
  toggleSidebar: (params: SideBarCategory) => void;
};

export default class SidebarTabs extends Component {
  props: Props;

  render() {
    let {currentSideBar, toggleSidebar, isSidebarOpened} = this.props;
    return (
      <View style={styles.mainContainer}>
        <Touchable onPress={() => toggleSidebar('report')}>
          <View
            style={[
              styles.container,
              isSidebarOpened && currentSideBar === 'report'
                ? styles.activeContainer
                : styles.inactiveContainer,
              colorStyles.thinShadow,
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color:
                    isSidebarOpened && currentSideBar === 'report'
                      ? 'white'
                      : THEME_COLOR,
                },
              ]}
            >
              Browse Report
            </Text>
            <Image
              source={
                isSidebarOpened && currentSideBar === 'report'
                  ? WhiteFile
                  : BlueFile
              }
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </Touchable>
        <Touchable onPress={() => toggleSidebar('widget')}>
          <View
            style={[
              styles.container,
              isSidebarOpened && currentSideBar === 'widget'
                ? styles.activeContainer
                : styles.inactiveContainer,
              colorStyles.thinShadow,
              {top: 260, height: 180},
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color:
                    isSidebarOpened && currentSideBar === 'widget'
                      ? 'white'
                      : THEME_COLOR,
                },
              ]}
            >
              Add New Widget
            </Text>
            <MaterialIcon
              name="add"
              style={StyleSheet.flatten([styles.icon, styles.iconColor])}
            />
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    zIndex: 21,
    right: 0,
    top: 0,
  },
  container: {
    position: 'absolute',
    top: 60,
    width: 35,
    height: 160,
    zIndex: 21,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inactiveContainer: {
    backgroundColor: 'white',
    right: 265,
    borderWidth: 1,
    borderColor: THEME_COLOR,
  },
  activeContainer: {
    backgroundColor: THEME_COLOR,
    right: 265,
  },
  text: {
    position: 'fixed',
    alignSelf: 'center',
    transform: [{rotate: '270deg'}],
    width: 120,
    textAlign: 'right',
  },
  icon: {
    width: 17,
    height: 17,
    transform: [{rotate: '270deg'}],
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  iconColor: {
    color: THEME_COLOR,
  },
});
