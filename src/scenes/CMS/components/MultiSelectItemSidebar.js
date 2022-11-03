// @flow
import React, {Component} from 'react';
import autobind from 'class-autobind';
import {Checkbox} from 'material-ui';
import {StyleSheet, Touchable} from 'react-primitives';
import {
  View,
  Button,
  TextInput,
  Text,
  MaterialIcon,
  Icon,
  ScrollView,
} from '../../../general/components/coreUIComponents';

import {
  TEXT_COLOR,
  THEME_COLOR,
  LIGHT_GREY,
  ALTERNATIVE_GREY,
  MEDIUM_GREY,
  MAIN_BLUE,
} from '../../../general/constants/colors';
import {
  SMALL_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
} from '../../../general/constants/text';

type State = {
  selectedItems: Set<string>;
  filterValue: string;
  isAssignedFilterActive: boolean;
};

type ItemID = string;

type Item = {
  id: ItemID;
  name: string;
};
type Props = {
  icon?: string;
  searchPlaceholder: string;
  noItemFound: string;
  itemList: Array<Item>;
  selectedItems: Array<ItemID>;
  onConfirm: (selectedItems: Array<ItemID>) => void;
  toggleSidebar: (command: 'open' | 'close', data?: Array<ItemID>) => void;
  onAddData?: () => void;
  addDataButtonLabel?: string;
};

export type MultiSelectItemSidebarProps = Props;

export default class MultiSelectItemSidebar extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);

    this.state = {
      selectedItems: this._getSelectedItems(this.props.selectedItems),
      filterValue: '',
      isAssignedFilterActive: false,
    };
  }

  componentWillReceiveProps(newProps: Props) {
    let oldProps = this.props;
    if (newProps.selectedItems.length !== oldProps.selectedItems.length) {
      this.setState({
        selectedItems: this._getSelectedItems(newProps.selectedItems),
      });
    }
  }
  _isTickAll(itemList: Array<Item>) {
    let {selectedItems} = this.state;
    for (let {id} of itemList) {
      if (!selectedItems.has(id)) {
        return false;
      }
    }
    if (itemList.length === 0) {
      return false;
    }
    return true;
  }
  _tickAll(itemList: Array<Item>) {
    let {selectedItems} = this.state;
    let newSelectedItems = new Set(selectedItems);
    let isTickAll = this._isTickAll(itemList);
    let isAssignedFilterActive = false;
    if (!isTickAll) {
      for (let {id} of itemList) {
        if (!selectedItems.has(id)) {
          newSelectedItems.add(id);
        }
      }
      isAssignedFilterActive = true;
    } else {
      for (let {id} of itemList) {
        newSelectedItems.delete(id);
      }
    }
    this.setState({
      selectedItems: newSelectedItems,
      isAssignedFilterActive,
    });
  }
  render() {
    let {selectedItems, filterValue, isAssignedFilterActive} = this.state;
    let {
      searchPlaceholder,
      itemList,
      toggleSidebar,
      onAddData,
      addDataButtonLabel,
      noItemFound,
      icon,
    } = this.props;

    let filteredItemList = itemList.filter(
      (item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase()) &&
        (isAssignedFilterActive
          ? selectedItems.has(item.id)
          : !selectedItems.has(item.id)),
    );

    return (
      <View style={styles.container}>
        <View style={{paddingHorizontal: 11, marginBottom: 10}}>
          <TextInput
            fullWidth
            hintText={searchPlaceholder}
            value={filterValue}
            onTextChange={(newFilterValue) =>
              this.setState({filterValue: newFilterValue})}
            icon="search"
            iconStyle={{color: LIGHT_GREY}}
          />
        </View>
        <View style={styles.itemsHeader}>
          <View style={{width: 40}}>
            <Checkbox
              uncheckedIcon={
                <MaterialIcon
                  name="check-box-outline-blank"
                  color={LIGHT_GREY}
                />
              }
              checkedIcon={
                <MaterialIcon name="check-box" style={{color: THEME_COLOR}} />
              }
              checked={this._isTickAll(filteredItemList)}
              onCheck={() => this._tickAll(filteredItemList)}
              style={styles.checkboxIcon}
            />
          </View>
          <View style={[styles.flexRow, styles.switchContainer]}>
            <Touchable
              onPress={() => this.setState({isAssignedFilterActive: true})}
            >
              <View style={styles.switchItemContainer}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: isAssignedFilterActive ? MAIN_BLUE : MEDIUM_GREY,
                  }}
                >
                  ASSIGNED
                </Text>
              </View>
            </Touchable>
            <Touchable
              onPress={() => this.setState({isAssignedFilterActive: false})}
            >
              <View style={styles.switchItemContainer}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: isAssignedFilterActive ? MEDIUM_GREY : MAIN_BLUE,
                  }}
                >
                  UNASSIGNED
                </Text>
              </View>
            </Touchable>
          </View>
        </View>
        <View style={styles.groupList}>
          {filteredItemList.length === 0 ? (
            <View style={styles.switchItemContainer}>
              <Text style={{textAlign: 'center', color: LIGHT_GREY}}>
                {noItemFound}
              </Text>
            </View>
          ) : (
            <ScrollView>
              {filteredItemList.map((item, index) => {
                return (
                  <View style={styles.rowItem} key={index}>
                    <Checkbox
                      uncheckedIcon={
                        <MaterialIcon
                          name="check-box-outline-blank"
                          color={LIGHT_GREY}
                        />
                      }
                      checkedIcon={
                        <MaterialIcon
                          name="check-box"
                          style={{color: THEME_COLOR}}
                        />
                      }
                      checked={selectedItems.has(item.id)}
                      onCheck={() => this._selectItem(item.id)}
                      style={StyleSheet.flatten([
                        styles.checkboxIcon,
                        {width: 40},
                      ])}
                    />
                    <View style={styles.checklistContent}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          marginHorizontal: 8,
                        }}
                      >
                        <Icon name={icon || 'user'} />
                      </View>
                      <Text>{item.name}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
        <View style={{marginTop: 10}}>
          {onAddData && addDataButtonLabel ? (
            <Button
              secondary
              label={addDataButtonLabel}
              style={styles.button}
              onPress={onAddData}
            />
          ) : null}

          <View style={styles.bottomButtons}>
            <Button
              secondary
              label="Cancel"
              style={styles.button}
              onPress={() =>
                toggleSidebar('close', [...this.state.selectedItems.values()])}
            />
            <Button
              primary
              label="Confirm"
              style={StyleSheet.flatten([styles.button, {marginLeft: 15}])}
              onPress={() => this._onConfirm()}
            />
          </View>
        </View>
      </View>
    );
  }

  _getSelectedItems(selectedItems: Array<ItemID>) {
    return new Set(
      this.props.itemList
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => item.id),
    );
  }

  _selectItem(item: string) {
    let {selectedItems} = this.state;
    if (selectedItems.has(item)) {
      selectedItems.delete(item);
    } else {
      selectedItems.add(item);
    }
    this.setState({selectedItems});
  }

  _onConfirm() {
    let {onConfirm, toggleSidebar} = this.props;
    let {selectedItems} = this.state;
    onConfirm(Array.from(selectedItems.values()));
    toggleSidebar('close', []);
  }
}

const styles = {
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  switchItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    height: '100%',
    width: '80%',
    paddingVertical: 8,
  },
  itemsHeader: {
    height: 46,
    width: '90%',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: ALTERNATIVE_GREY,
    flexDirection: 'row',
  },
  rowItem: {
    width: '90%',
    marginHorizontal: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupList: {
    flex: 1,
    paddingTop: 10,
  },
  bottomButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
  },
  checkbox: {
    paddingLeft: 12,
    marginBottom: 10,
    marginHorizontal: 10,
    alignSelf: 'stretch',
    height: 42,
  },
  checkboxIcon: {
    color: THEME_COLOR,
    width: 20,
  },
  checklistContent: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: LIGHT_GREY,
    width: '80%',
    overflow: 'scroll', // TODO: Improve this styling later
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 4,
  },
  checkboxLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: SMALL_FONT_SIZE,
    color: TEXT_COLOR,
  },
};
