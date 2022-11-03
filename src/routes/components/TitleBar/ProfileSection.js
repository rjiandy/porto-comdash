// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';

import {
  FilterButton,
  ExportButton,
  NotificationButton,
  PositionButton,
} from './Buttons';
import {StyleSheet, Touchable} from 'react-primitives';

import {
  View,
  Text,
  MaterialIcon,
} from '../../../general/components/coreUIComponents';

import {GREY} from '../../../general/constants/colors';

import ProfileDropdown from './ProfileDropdown';

import type {ROLE} from '../../../features/Access/CurrentUser-type';
import type {RootState} from '../../../general/stores/RootState';
import type {ActiveSceneTypeState} from '../../../features/ActiveSceneType/ActiveSceneType-type';
import MD5Hash from '../../../general/helpers/MD5Hash';

type State = {
  isProfileDropdownOpened: boolean;
};

type Props = {
  name: string;
  role: ROLE;
  activeSceneType: ActiveSceneTypeState;
  openExportDialog: () => void;
};

export class ProfileSection extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isProfileDropdownOpened: false,
      isExportOpened: false,
    };
  }
  _getInitialName() {
    let separatedFullName = this.props.name.split(' ').slice(0, 2);
    let initialName = '';
    for (let name of separatedFullName) {
      initialName += name[0] || '';
    }
    return initialName;
  }
  _formatFullName() {
    return this.props.name
      .split(' ')
      .slice(0, 2)
      .join(' ');
  }
  _getHashedNameColor() {
    let hash = MD5Hash(this._formatFullName() + 'a4LrMkffFc');
    let hue = parseInt(hash.slice(0, 2), 16) / 256 * 360;
    let sat = parseInt(hash.slice(2, 4), 16) / 256 * 45 + 30;
    let lit = parseInt(hash.slice(4, 6), 16) / 256 * 60 + 20;
    let color = `hsl(${hue}, ${sat}%, ${lit}%)`;
    return color;
  }
  render() {
    let {activeSceneType} = this.props;

    let disabled = activeSceneType === 'cms';
    return (
      <View style={styles.profileContainer}>
        {/* TODO: change it into group list of the current user */}
        <PositionButton activePosition="territory" disabled={disabled} />
        <FilterButton disabled={disabled} />
        <ExportButton
          openExportDialog={this.props.openExportDialog}
          disabled={disabled}
        />
        <NotificationButton />
        <Touchable
          onPress={() => this.setState({isProfileDropdownOpened: true})}
        >
          <View style={styles.flexRow}>
            <View
              style={[
                styles.profilePicture,
                {backgroundColor: this._getHashedNameColor()},
              ]}
            >
              <Text style={styles.nameInitial}>{this._getInitialName()}</Text>
            </View>
            <View style={{maxWidth: 140, marginRight: 20}}>
              <Text customStyle="title">{this._formatFullName() || ''}</Text>
            </View>

            <View>
              <MaterialIcon name="keyboard-arrow-down" style={{color: GREY}} />
            </View>
          </View>
        </Touchable>
        <ProfileDropdown
          status={this.state.isProfileDropdownOpened}
          role={this.props.role}
          onToggleSwitch={() => this.setState({isProfileDropdownOpened: false})}
        />
        {this.state.isProfileDropdownOpened ? (
          <Touchable
            onPress={() => this.setState({isProfileDropdownOpened: false})}
          >
            <View style={styles.overlay} />
          </Touchable>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  let {currentUser, activeSceneType} = state;
  let {user} = currentUser;
  return {
    name: (user && user.name) || '',
    role: user && user.role,
    activeSceneType,
  };
}

export default connect(mapStateToProps)(ProfileSection);

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInitial: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    cursor: 'default',
    zIndex: 18,
  },
  profilePicture: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
