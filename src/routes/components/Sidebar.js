// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';
import {View, Text} from '../../general/components/coreUIComponents';
import {THEME_COLOR, colorStyles} from '../../general/constants/colors';
import BrowseReport from './BrowseReport/BrowseReport';

type Props = {
  content: 'report' | 'widget' | 'export' | null;
};

export default class Sidebar extends Component {
  props: Props;

  render() {
    let {content} = this.props;
    let contentComponent;
    let titleText;
    switch (content) {
      case 'report': {
        contentComponent = <BrowseReport />;
        titleText = 'Browse Report';
        break;
      }
      case 'widget': {
        contentComponent = <View />;
        titleText = 'Add New Widget';
        break;
      }
      default: {
        break;
      }
      // TODO: put case for 'widget' and 'export' later
    }
    return (
      <View
        style={[
          styles.rightNavigation,
          styles.centerAligned,
          colorStyles.thickShadow,
        ]}
      >
        <Text customStyle="title" style={styles.sideBarTitle}>
          {titleText}
        </Text>
        <View style={styles.separatorBar} />
        {contentComponent}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rightNavigation: {
    backgroundColor: 'white',
    bottom: 0,
    padding: 18,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 265,
    zIndex: 20,
  },
  centerAligned: {
    alignItems: 'stretch',
  },
  sideBarTitle: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  separatorBar: {
    height: 3,
    backgroundColor: THEME_COLOR,
    borderRadius: 2,
    marginBottom: 20,
  },
});
