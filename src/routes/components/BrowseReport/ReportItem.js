// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {StyleSheet, Touchable} from 'react-primitives';

import {
  View,
  Text,
  Icon,
  MaterialIcon,
} from '../../../general/components/coreUIComponents';
import {
  THEME_COLOR,
  LIGHT_GREY,
  MEDIUM_GREY,
  ALTERNATIVE_GREY,
} from '../../../general/constants/colors';

type State = {
  isPressed: boolean;
  isHovered: boolean;
};

type Props = {
  favorited?: boolean;
  disabled?: boolean;
  icon?: string;
  text?: string;
  onPress: () => void;
  onFavoritePress?: () => void;
};

export default class ReportItem extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isPressed: false,
      isHovered: false,
    };
  }

  render() {
    let {isPressed, isHovered} = this.state;
    let {
      text,
      icon,
      favorited,
      disabled,
      onPress,
      onFavoritePress,
    } = this.props;

    let pressedStyle =
      !disabled && isPressed
        ? {
          borderWidth: 2,
          borderColor: THEME_COLOR,
          marginVertical: 8,
          paddingHorizontal: 13.5,
          paddingVertical: 11.5,
        }
        : null;
    let hoveredStyle =
      !disabled && isHovered
        ? {
          backgroundColor: ALTERNATIVE_GREY,
        }
        : null;
    return (
      <Touchable
        onPress={!disabled && onPress}
        onPressIn={this._onPressIn}
        onPressOut={this._onPressOut}
      >
        <View
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
        >
          <View
            style={[
              styles.container,
              hoveredStyle,
              pressedStyle,
              disabled ? styles.disabled : null,
            ]}
          >
            <View
              style={[
                styles.flex,
                styles.rowFlexed,
                styles.centerAligned,
                icon !== 'file' && icon !== 'folder' && icon !== 'back'
                  ? styles.contentCenterAligned
                  : null,
              ]}
            >
              <Icon name={icon} style={styles.icon} />
              {text && text !== '' ? (
                <Text
                  customStyle="small"
                  style={[{marginLeft: 10}, disabled && {color: MEDIUM_GREY}]}
                >
                  {text}
                </Text>
              ) : null}
            </View>
            {icon === 'file' && (
              <Touchable onPress={onFavoritePress}>
                <View>
                  {/* TODO: use star border & filled images */}
                  <MaterialIcon
                    onPress={() => {}}
                    name={favorited ? 'star' : 'star-border'}
                    color={favorited ? THEME_COLOR : MEDIUM_GREY}
                    iconButtonStyle={{padding: 0, width: 24, height: 24}}
                    style={{fontSize: 18}}
                  />
                </View>
              </Touchable>
            )}
          </View>
        </View>
      </Touchable>
    );
  }

  _onPressIn() {
    this.setState({isPressed: true});
  }

  _onPressOut() {
    this.setState({isPressed: false});
  }
  _onMouseEnter() {
    this.setState({isHovered: true});
  }
  _onMouseLeave() {
    this.setState({isHovered: false});
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  centerAligned: {
    alignItems: 'center',
  },
  contentCenterAligned: {
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  container: {
    borderWidth: 0.5,
    borderColor: LIGHT_GREY,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 9,
  },
  icon: {
    width: 18,
    height: 18,
  },
});
