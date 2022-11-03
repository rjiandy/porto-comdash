// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import autobind from 'class-autobind';
import triangle from '../../../assets/images/dropdown-triangle.png';
import positionList from './PositionList';

import {StyleSheet, Touchable, Image} from 'react-primitives';
import {
  colorStyles,
  THEME_COLOR,
  LIGHT_GREY,
  GREY,
  MEDIUM_GREY,
} from '../../../general/constants/colors';
import {SCREEN_BREAK_POINT} from '../../../general/constants/size';
import {
  View,
  Text,
  MaterialIcon,
} from '../../../general/components/coreUIComponents';

import type {RootState} from '../../../general/stores/RootState';

type Props = {
  activePosition: string;
  screenWidth: number;
  disabled: boolean;
};
type State = {
  isDropdownOpened: boolean;
  selectedPosition: string;
};

class PositionButton extends Component {
  props: Props;
  state: State;
  _isBelowBreakpoint: boolean = false;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isDropdownOpened: false,
      selectedPosition: this.props.activePosition,
    };
  }

  render() {
    let {isDropdownOpened, selectedPosition} = this.state;
    let {screenWidth} = this.props;

    this._isBelowBreakpoint = screenWidth < SCREEN_BREAK_POINT;
    let position = positionList.get(selectedPosition || 'brand');
    let {name = 'Brand', iconName = 'brand'} = position || {};

    return (
      <View style={{marginRight: 25}}>
        {this._renderButton(iconName, name)}
        {this._renderDropdown(isDropdownOpened)}
        {this._renderOverlay(isDropdownOpened)}
      </View>
    );
  }

  _renderButton(iconName: string, name: string) {
    let {disabled} = this.props;
    return (
      <Touchable
        onPress={() => {
          !disabled && this.setState({isDropdownOpened: true});
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {this._isBelowBreakpoint ? null : (
            <Text
              style={[styles.positionText, disabled ? styles.disabled : null]}
            >
              {name}
            </Text>
          )}
          <MaterialIcon
            name="keyboard-arrow-down"
            style={{
              ...StyleSheet.flatten([
                styles.positionArrow,
                disabled ? styles.disabled : {},
              ]),
            }}
          />
        </View>
      </Touchable>
    );
  }

  _renderDropdown(isDropdownOpened: boolean) {
    return isDropdownOpened ? (
      <View style={[styles.filterContent, colorStyles.thinShadow]}>
        <Image source={triangle} style={styles.triangle} />
        {Array.from(positionList.values()).map((position, index) => {
          return (
            <Touchable
              key={index}
              onPress={() =>
                this.setState({
                  selectedPosition: position.name.toLowerCase(),
                  isDropdownOpened: false,
                })}
            >
              <View
                style={[
                  styles.dropdownItem,
                  index === 2 ? null : styles.bottomBorder,
                ]}
              >
                <Text style={{color: THEME_COLOR}}>{position.name}</Text>
              </View>
            </Touchable>
          );
        })}
      </View>
    ) : null;
  }

  _renderOverlay(isDropdownOpened: boolean) {
    return isDropdownOpened ? (
      <Touchable onPress={() => this.setState({isDropdownOpened: false})}>
        <View style={styles.overlay} />
      </Touchable>
    ) : null;
  }
}

function mapStateToProps(state: RootState) {
  let {windowSize} = state;
  return {
    screenWidth: windowSize.width,
  };
}

export default connect(mapStateToProps)(PositionButton);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  justifyAround: {
    justifyContent: 'space-around',
  },
  flexRow: {
    flexDirection: 'row',
  },
  headerText: {
    color: THEME_COLOR,
    fontSize: 14,
    marginTop: 12,
    marginLeft: 21,
    marginBottom: 8,
  },
  overlay: {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 4,
    cursor: 'default',
  },
  button: {
    height: 25,
    minWidth: 25,
  },
  positionText: {
    marginRight: 10,
  },
  positionArrow: {
    color: GREY,
    marginTop: 3,
  },
  filterContent: {
    width: 180,
    height: 100,
    borderWidth: 1,
    borderColor: '#EBECF0',
    position: 'absolute',
    top: 57,
    backgroundColor: 'white',
    right: 0,
    borderRadius: 4,
    zIndex: 5,
  },
  triangle: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -18,
    right: 0,
    zIndex: 6,
  },
  dropdownItem: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 15,
    paddingVertical: 10,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY,
  },
  disabled: {
    color: MEDIUM_GREY,
  },
});
