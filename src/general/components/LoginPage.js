// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {View, TextInput, Text} from './coreUIComponents';

import rightArrow from '../../assets/images/right-arrow.svg';

import {StyleSheet, Image, Touchable} from 'react-primitives';
import {colorStyles, THEME_COLOR} from '../constants/colors';

type State = {
  username: string;
  password: string;
};

type Props = {
  onLoginPress: State => mixed;
};

export default class LoginPage extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      username: '',
      password: '',
    };
  }

  render() {
    return (
      <View
        accessibilityRole="form"
        style={styles.container}
        onSubmit={this._onSubmit}
      >
        <View style={[styles.content, colorStyles.thinShadow]}>
          <View style={[styles.flex, styles.justifyCenter, styles.alignCenter]}>
            <Text style={styles.title}>Login</Text>
          </View>
          <View style={[styles.justifyCenter, styles.alignCenter]}>
            <TextInput
              id="1"
              value={this.state.username}
              placeholder="username"
              onTextChange={(value) => this.setState({username: value})}
              containerStyle={styles.textInput}
            />
            <TextInput
              id="2"
              type="password"
              value={this.state.password}
              placeholder="password"
              onTextChange={(value) => this.setState({password: value})}
              containerStyle={styles.textInput}
            />
          </View>
          <View style={{height: 0, overflow: 'hidden'}}>
            {/* Include a hidden button so the form will submit on enter. */}
            {/* Ideally the Touchable View below should be a button, but react-primitives will not render a <button>. */}
            <button type="submit" />
          </View>
          <Touchable onPress={this._onSubmit}>
            <View style={styles.iconContainer}>
              <Image source={rightArrow} style={styles.arrowIcon} />
            </View>
          </Touchable>
        </View>
      </View>
    );
  }

  _onSubmit(event: Event) {
    event.preventDefault();
    let {username, password} = this.state;
    this.props.onLoginPress({username, password});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: 40,
    height: 40,
  },
  content: {
    backgroundColor: '#F6F7FB',
    borderRadius: 8,
    width: 440,
    height: 260,
  },
  textInput: {
    alignSelf: 'center',
    marginTop: 10,
    width: 320,
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  title: {
    marginTop: 24,
    marginBottom: 14,
    fontSize: 24,
    color: THEME_COLOR,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLOR,
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    bottom: -45,
    left: 175,
  },
});
