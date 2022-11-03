// @flow
import React, {Component} from 'react';
import {StyleSheet, Animated} from 'react-primitives';

import {View} from '../general/components/coreUIComponents';
import {Triangle} from '../general/components/shapesComponent';
import {THEME_COLOR, colorStyles} from '../general/constants/colors';
import Drawer from './Drawer';
import WidgetDisplay from './WidgetDisplay';
// import WidgetLibrary from './WidgetLibrary';

type State = {
  isScreenDimmed: boolean;
};

class DashboardComponent extends Component {
  state: State;
  _drawerAnimatedValue: Animated.Value;
  _drawerAnimatedValue = new Animated.Value(1);
  _widgetLibraryAnimatedValue = new Animated.Value(0);

  constructor() {
    super(...arguments);
    this.state = {
      isScreenDimmed: false,
    };
  }

  render() {
    let {isScreenDimmed} = this.state;
    let width = this._drawerAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0],
    });

    let opacity = this._drawerAnimatedValue.interpolate({
      inputRange: [0, 0.5],
      outputRange: [1, 0],
    });

    return (
      <View style={styles.container}>
        <Drawer
          drawerAnimatedValue={this._drawerAnimatedValue}
          onDrawerClose={() => {
            this._animate(this._drawerAnimatedValue, 0);
          }}
          onAddWidget={() => {
            this._animate(this._drawerAnimatedValue, 1.75);
            this._toggleDimScreen();
          }}
          onCloseLibrary={() => {
            this._animate(this._drawerAnimatedValue, 1);
            this._toggleDimScreen();
          }}
        />
        <View style={styles.divider}>
          <Animated.View
            style={[
              styles.expandButton,
              colorStyles.thickShadow,
              {width, opacity},
            ]}
            onClick={() => this._animate(this._drawerAnimatedValue, 1)}
          >
            <Triangle size={1.3} orientation="right" color={THEME_COLOR} />
          </Animated.View>
        </View>
        <Animated.View style={{flex: 1, paddingLeft: width}}>
          {/* <WidgetLibrary
            animatedvalue={this._widgetLibraryAnimatedValue}
            onClose={() =>
              this._animate(this._widgetLibraryAnimatedValue, false)}
          /> */}
          {isScreenDimmed ? <View style={styles.dimmedScreen} /> : null}
          <WidgetDisplay />
        </Animated.View>
      </View>
    );
  }

  _toggleDimScreen() {
    let {isScreenDimmed} = this.state;
    this.setState({isScreenDimmed: !isScreenDimmed});
  }

  _animate(
    animatedValue: Animated.Value,
    toValue: number,
    callback?: Function,
  ) {
    Animated.timing(animatedValue, {
      toValue,
      duration: 500,
    }).start(() => {
      callback && callback();
    });
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  divider: {
    width: 0,
  },
  expandButton: {
    position: 'absolute',
    backgroundColor: 'white',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    left: 0,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    zIndex: 1,
    cursor: 'pointer',
  },
  dimmedScreen: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
    zIndex: 1,
  },
});

export default DashboardComponent;
