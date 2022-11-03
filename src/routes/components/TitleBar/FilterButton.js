// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import autobind from 'class-autobind';
import triangle from '../../../assets/images/dropdown-triangle.png';
import {StyleSheet, Touchable, Image} from 'react-primitives';

import {colorStyles, THEME_COLOR} from '../../../general/constants/colors';

import type {
  TerritoryAccess,
  MyBrandFamily,
} from '../../../features/Access/CurrentUser-type';

import type {Dispatch} from '../../../general/stores/Action';
import type {RootState} from '../../../general/stores/RootState';

import {
  View,
  Button,
  Text,
  Icon,
  Dropdown,
} from '../../../general/components/coreUIComponents';

type Props = {
  disabled: boolean;
  territories: Array<TerritoryAccess>;
  brandFamilies: Array<MyBrandFamily>;
  selectedTerritory: ?string;
  selectedBrandFamily: ?string;
  onFilterClear: () => void;
  onTerritorySelected: (territory: string) => void;
  onBrandFamilySelected: (brandFamily: string) => void;
};

type State = {
  isDropdownOpened: boolean;
};

export class FilterButton extends Component {
  props: Props;
  state: State;
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isDropdownOpened: false,
    };
  }

  render() {
    let {isDropdownOpened} = this.state;
    let {
      territories,
      brandFamilies,
      selectedBrandFamily,
      selectedTerritory,
      onTerritorySelected,
      onBrandFamilySelected,
      disabled,
    } = this.props;
    return (
      <View style={{marginRight: 30}}>
        <Touchable
          onPress={() => {
            !disabled && this.setState({isDropdownOpened: true});
          }}
        >
          <View>
            <Icon
              name="filter"
              color={disabled ? 'grey' : 'blue'}
              style={styles.button}
            />
          </View>
        </Touchable>
        {isDropdownOpened ? (
          <Image source={triangle} style={styles.triangle} />
        ) : null}
        {isDropdownOpened ? (
          <View style={[styles.filterContent, colorStyles.thinShadow]}>
            <Text style={styles.headerText}>Global Filter</Text>
            <View style={[styles.flex, styles.justifyAround, styles.flexRow]}>
              <Dropdown
                label="Territory"
                options={territories.map((territory) => ({
                  text: territory,
                  value: territory,
                }))}
                selectedValue={selectedTerritory}
                onSelect={onTerritorySelected}
              />
              <Dropdown
                label="Brand Family"
                options={brandFamilies.map((brandFamily) => ({
                  text: brandFamily,
                  value: brandFamily,
                }))}
                selectedValue={selectedBrandFamily}
                onSelect={onBrandFamilySelected}
              />
              <Button
                primary
                style={{marginTop: 11, height: 32, lineHeight: 0}}
                label="Set to default"
                backgroundColor={
                  selectedTerritory === territories[0] &&
                  selectedBrandFamily === brandFamilies[0]
                    ? 'grey'
                    : THEME_COLOR
                }
                disabled={
                  selectedTerritory === territories[0] &&
                  selectedBrandFamily === brandFamilies[0]
                }
                onPress={this._onFilterReset}
              />
            </View>
          </View>
        ) : null}
        {isDropdownOpened ? (
          <Touchable onPress={() => this.setState({isDropdownOpened: false})}>
            <View style={styles.overlay} />
          </Touchable>
        ) : null}
      </View>
    );
  }

  _onFilterReset() {
    let {
      onBrandFamilySelected,
      onTerritorySelected,
      territories,
      brandFamilies,
    } = this.props;
    onTerritorySelected(territories[0].toString());
    onBrandFamilySelected(brandFamilies[0].toString());
  }
}

function mapStateToProps(state: RootState) {
  let {globalFilter, currentUser} = state;
  let {selectedTerritory, selectedBrandFamily} = globalFilter;
  let {user} = currentUser;
  return {
    brandFamilies:
      (user && user.brandFamily.map(({brandFamily}) => brandFamily)) || [],
    territories:
      (user && user.territories.map(({territory}) => territory)) || [],
    selectedTerritory,
    selectedBrandFamily,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onTerritorySelected(selectedTerritory) {
      dispatch({
        type: 'TERRITORY_SELECTED',
        territory: selectedTerritory,
      });
    },
    onBrandFamilySelected(selectedBrandFamily) {
      dispatch({
        type: 'BRAND_FAMILY_SELECTED',
        brandFamily: selectedBrandFamily,
      });
    },
    onFilterClear() {
      dispatch({
        type: 'GLOBAL_FILTER_CLEARED',
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterButton);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  justifyAround: {
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
  },
  headerText: {
    color: THEME_COLOR,
    fontSize: 14,
    marginBottom: 15,
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
  filterContent: {
    width: 480,
    height: 110,
    borderWidth: 1,
    borderColor: '#EBECF0',
    position: 'fixed',
    top: 88,
    backgroundColor: 'white',
    right: 50,
    borderRadius: 4,
    zIndex: 5,
    justifyContent: 'space-between',
    padding: 15,
  },
  triangle: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: 4,
    bottom: -34,
    zIndex: 6,
  },
});
