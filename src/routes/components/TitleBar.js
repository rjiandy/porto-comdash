// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Image} from 'react-primitives';
import autobind from 'class-autobind';
import ProfileSection from './TitleBar/ProfileSection';
import ExportWidget from '../../scenes/ExportWidget';
import {View} from '../../general/components/coreUIComponents';
import {colorStyles} from '../../general/constants/colors';
import logo from '../../assets/images/logo-v1.svg';
import logoIcon from '../../assets/images/favicon-hi.svg';
import {SCREEN_BREAK_POINT} from '../../general/constants/size';

import type {RootState} from '../../general/stores/RootState.js';

type State = {
  isProfileDropdownOpened: boolean;
  activePosition: string;
  isExportOpened: boolean;
};

type Props = {
  width: number;
};

export class TitleBar extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isProfileDropdownOpened: false,
      activePosition: 'brand',
      isExportOpened: false,
    };
  }

  render() {
    let {width} = this.props;
    return (
      <View style={[styles.topNavigation, colorStyles.thinShadow]}>
        <View style={styles.titleBar}>
          {width < SCREEN_BREAK_POINT ? (
            <Image
              source={logoIcon}
              style={styles.logoIconImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          )}
          <ProfileSection
            toggleDropdown={() =>
              this.setState({isProfileDropdownOpened: true})}
            openExportDialog={this._onToggleExportDialog}
          />
        </View>
        {this.state.isExportOpened ? (
          <ExportWidget onToggleExportDialog={this._onToggleExportDialog} />
        ) : null}
      </View>
    );
  }

  _onToggleExportDialog() {
    this.setState({isExportOpened: !this.state.isExportOpened});
  }
}

function mapStateToProps(state: RootState) {
  let {height, width} = state.windowSize;
  return {
    height,
    width,
  };
}

export default connect(mapStateToProps)(TitleBar);

const styles = StyleSheet.create({
  topNavigation: {
    backgroundColor: 'white',
    justifyContent: 'center',
    zIndex: 2,
  },
  titleBar: {
    flexDirection: 'row',
    height: 88,
    paddingLeft: 20,
    paddingRight: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoIconImage: {
    height: 50,
    width: 50,
    borderRadius: 5,
  },
  logoImage: {
    height: 24,
    width: 220,
  },
});
