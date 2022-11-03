// @flow

import React, {Component} from 'react';
import {StyleSheet, Touchable, Image} from 'react-primitives';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';

import {
  View,
  Text,
  ToggleSwitch,
} from '../../../general/components/coreUIComponents';
import {
  THEME_COLOR,
  LIGHT_GREY,
  colorStyles,
} from '../../../general/constants/colors';
import triangle from '../../../assets/images/dropdown-triangle.png';

import type {ROLE} from '../../../features/Access/CurrentUser-type';
import type {ActiveSceneTypeState} from '../../../features/ActiveSceneType/ActiveSceneType-type';
import type {Dispatch} from '../../../general/stores/Action';
import type {RootState} from '../../../general/stores/RootState';
import type {HelpLink} from '../../../scenes/CMS/HelpLink/HelpLink-type';

type Props = {
  status: boolean;
  helpLinkList: Array<HelpLink>;
  history?: {location: {pathname: string}; push: (pathName: string) => void};
  role: ROLE;
  activeSceneType: ActiveSceneTypeState;
  onActiveSceneTypeChanged: (newSceneType: ActiveSceneTypeState) => void;
  onToggleSwitch: () => void;
  onFetchHelpLinks: () => void;
};

export class ProfileDropdown extends Component {
  props: Props;

  componentWillReceiveProps(nextProps: Props) {
    let {history, onActiveSceneTypeChanged} = nextProps;
    if (history) {
      let {location} = history;
      if (location.pathname.startsWith('/dashboard')) {
        onActiveSceneTypeChanged('dashboard');
      } else if (location.pathname === '/cms') {
        onActiveSceneTypeChanged('cms');
      }
    }
  }

  render() {
    let {
      status,
      history,
      activeSceneType,
      onActiveSceneTypeChanged,
    } = this.props;
    return status ? (
      <Touchable onPress={() => {}}>
        <View style={styles.container}>
          <Image source={triangle} style={styles.triangle} />
          <View style={[styles.pane, colorStyles.thinShadow]}>
            {this.props.role !== 'USER' ? (
              <View>
                <Text customStyle="title" style={styles.title}>
                  Access Menu
                </Text>
                <ToggleSwitch
                  label={{label1: 'DashBoard', label2: 'CMS'}}
                  style={styles.switch}
                  value={activeSceneType === 'cms'}
                  onToggle={() => {
                    if (activeSceneType === 'dashboard') {
                      history && history.push('/cms');
                      onActiveSceneTypeChanged('cms');
                      this.props.onToggleSwitch();
                    } else {
                      history && history.push('/dashboard');
                      onActiveSceneTypeChanged('dashboard');
                      this.props.onToggleSwitch();
                    }
                  }}
                />
                <View style={styles.separatorBar} />
              </View>
            ) : null}
            <Text customStyle="title" style={styles.title}>
              Help
            </Text>
            {this._renderHelpLink()}
          </View>
        </View>
      </Touchable>
    ) : null;
  }

  _renderHelpLink() {
    let {helpLinkList} = this.props;
    return helpLinkList.map(({name, linkUrl}) => (
      <Touchable
        key={name}
        onPress={() => window.open(this._getExternalLink(linkUrl), '_blank')}
      >
        <Text customStyle="small" style={styles.helpLink}>
          {name}
        </Text>
      </Touchable>
    ));
  }

  _getExternalLink(link: string) {
    // TODO: make sure the server gives us full path, including http or https
    if (link.includes('http')) {
      return link;
    } else {
      return 'http://' + link;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    right: 0,
    top: 88,
    width: 265,
    zIndex: 21,
    cursor: 'auto',
  },
  pane: {
    paddingVertical: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EBECF0',
    borderRadius: 4,
  },
  triangle: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -17,
    right: 32,
    zIndex: 6,
  },
  title: {
    marginHorizontal: 25,
    marginBottom: 20,
  },
  separatorBar: {
    height: 1,
    backgroundColor: LIGHT_GREY,
    marginVertical: 20,
  },
  switch: {
    marginLeft: 40,
    marginBottom: 10,
  },
  helpLink: {
    color: THEME_COLOR,
    marginLeft: 40,
    marginBottom: 15,
  },
});

function connectStateToProps(state: RootState) {
  let user = state.currentUser.user;
  return {
    activeSceneType: state.activeSceneType,
    helpLinkList: (user && user.helpLinks) || [],
  };
}

function connectDispatchToProps(dispatch: Dispatch) {
  return {
    onActiveSceneTypeChanged: (newSceneType: ActiveSceneTypeState) => {
      dispatch({
        type: 'ACTIVE_SCENE_TYPE_CHANGED',
        newSceneType,
      });
    },
  };
}

export default withRouter(
  connect(connectStateToProps, connectDispatchToProps)(ProfileDropdown),
);
