// @flow

import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-primitives';
import {BACKGROUND} from '../constants/colors';
import Transition from 'react-transition-group/Transition';
import autobind from 'class-autobind';

const AnimatedWrapperHOC = (WrappedComponent: ReactClass<*>): ReactClass<*> =>
  class AnimatedWrapper extends Component {
    _value: Animated.Value;

    constructor() {
      super(...arguments);
      autobind(this);
      this._value = new Animated.Value(0);
    }

    _onEntering() {
      setTimeout(
        () => Animated.spring(this._value, {toValue: 1}).start(),
        250
      );
    }

    _onExiting() {
      Animated.spring(this._value, {toValue: 0}).start();
    }

    render() {
      const style = {
        opacity: this._value,
        top: this._value.interpolate({
          inputRange: [0, 1],
          outputRange: ['12px', '0px'],
        }),
      };
      return (
        <Transition
          onEnter={this._onEntering}
          onEntering={this._onEntering}
          onExiting={this._onExiting}
          timeout={250}
          {...this.props}
        >
          <Animated.View style={[styles.wrapper, style]}>
            <View style={styles.padding}>
              <WrappedComponent />
            </View>
          </Animated.View>
        </Transition>
      );
    }
  };

export default AnimatedWrapperHOC;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  padding: {
    backgroundColor: BACKGROUND,
  },
});
