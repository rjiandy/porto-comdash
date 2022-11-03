// @flow

import React from 'react';

import {StyleSheet} from 'react-primitives';
import {SelectField, MenuItem} from 'material-ui';

import wrapComponent from '../../helpers/wrapComponent';
import getStringPluralForm from '../../helpers/getStringPluralForm';

import {
  PLACEHOLDER_TEXT_COLOR,
  THEME_COLOR,
  DARK_GREY,
  MEDIUM_GREY,
  ALTERNATIVE_GREY,
} from '../../constants/colors';
import {View, MaterialIcon, Icon} from '../coreUIComponents';
import {DEFAULT_FONT_FAMILY, SMALL_FONT_SIZE} from '../../constants/text';

type Value = number | string | null | boolean;

type MenuItemType = {
  value?: Value;
  text: string;
};

type Props = {
  label: string;
  selectedValue: Value | Array<Value>;
  onSelect: (newSelectedValue: Value | Array<Value>, index?: number) => void;
  options: Array<MenuItemType | string>;
  multiple?: boolean;
  style?: StyleSheetTypes;
  menuItemStyle?: StyleSheetTypes;
  containerStyle?: StyleSheetTypes;
  width?: number;
  withNullSelection?: boolean;
  disabled?: boolean;
};

export const DROPDOWN_DEFAULT_WIDTH = 150;

export function Dropdown(props: Props) {
  let {
    label,
    selectedValue,
    onSelect,
    options,
    multiple,
    style,
    menuItemStyle,
    containerStyle,
    width,
    withNullSelection,
    disabled,
    ...otherProps
  } = props;
  let handleChange = (event, index, value) => {
    if (onSelect) {
      if (
        // when all items are already selected
        Array.isArray(selectedValue) &&
        selectedValue.length === options.length + 1
      ) {
        if (!value.includes('all')) {
          // when deselect all
          onSelect([], index);
        } else {
          // when deselect one item
          onSelect(value, index);
        }
      } else if (value.includes('all')) {
        // when select all
        onSelect(
          options.map(
            (option) =>
              typeof option === 'string' ? option : option.value || option.text,
          ),
          index,
        );
      } else {
        // when select one item
        onSelect(value, index);
      }
    }
  };

  let menuOptions = options.map((option) => {
    if (option != null && typeof option === 'object') {
      let {value, text} = option;
      return (
        <MenuItem
          key={text}
          checked={isChecked(selectedValue, value || text)}
          value={value || text}
          primaryText={text}
          leftIcon={
            multiple &&
            (isChecked(selectedValue, value || text) ? (
              <MaterialIcon name="check-box" color={THEME_COLOR} />
            ) : (
              <MaterialIcon name="check-box-outline-blank" color={DARK_GREY} />
            ))
          }
        />
      );
    } else {
      return (
        <MenuItem
          key={option}
          checked={isChecked(selectedValue, option)}
          value={option}
          primaryText={option}
          style={menuItemStyle}
          leftIcon={
            multiple &&
            (isChecked(selectedValue, option) ? (
              <MaterialIcon name="check-box" color={THEME_COLOR} />
            ) : (
              <MaterialIcon name="check-box-outline-blank" color={DARK_GREY} />
            ))
          }
        />
      );
    }
  });

  if (!multiple && withNullSelection) {
    menuOptions.unshift(<MenuItem key="null" value={null} primaryText="" />);
  }

  if (multiple) {
    if (
      Array.isArray(selectedValue) &&
      selectedValue.includes('all') &&
      selectedValue.length <= options.length
    ) {
      selectedValue.splice(selectedValue.indexOf('all'), 1);
    } else if (
      Array.isArray(selectedValue) &&
      selectedValue.length === options.length &&
      options.length > 0
    ) {
      selectedValue.push('all');
    }
    menuOptions.unshift(
      <MenuItem
        key="all"
        value="all"
        primaryText="All Items"
        style={menuItemStyle}
        checked={isChecked(selectedValue, 'all')}
        leftIcon={
          isChecked(selectedValue, 'all') ? (
            <MaterialIcon name="check-box" color={THEME_COLOR} />
          ) : (
            <MaterialIcon name="check-box-outline-blank" color={DARK_GREY} />
          )
        }
      />,
    );
  }

  return (
    <View
      style={[
        styles.outerContainer,
        containerStyle,
        width && {width: width + 2},
      ]}
    >
      <SelectField
        autoWidth
        multiple={multiple || false}
        floatingLabelText={label}
        floatingLabelStyle={StyleSheet.flatten([
          styles.label,
          {left: 10, color: PLACEHOLDER_TEXT_COLOR, zIndex: 0},
        ])}
        labelStyle={StyleSheet.flatten([styles.label, {left: 10}])}
        menuItemStyle={StyleSheet.flatten([
          styles.label,
          {alignSelf: 'center'},
        ])}
        selectedMenuItemStyle={StyleSheet.flatten(styles.label)}
        value={selectedValue}
        selectionRenderer={(selectedValue) => {
          if (Array.isArray(selectedValue)) {
            if (selectedValue.includes('all')) {
              return `All ${getStringPluralForm(label)}`;
            } else {
              return selectedValue.join(', ');
            }
          } else {
            return selectedValue;
          }
        }}
        onChange={handleChange}
        style={StyleSheet.flatten([
          styles.container,
          style,
          width && {width: width},
          disabled && {backgroundColor: ALTERNATIVE_GREY},
        ])}
        dropDownMenuProps={{
          autoWidth: true,
          iconButton: (
            <Icon
              name="keyboard-arrow-down"
              color="grey"
              iconStyle={{cursor: disabled && 'not-allowed'}}
              containerStyle={{
                alignItems: 'center',
                cursor: disabled && 'not-allowed',
              }}
            />
          ),
        }}
        menuStyle={StyleSheet.flatten(styles.menu)}
        iconStyle={StyleSheet.flatten(styles.icon)}
        underlineStyle={StyleSheet.flatten(styles.underline)}
        disabled={disabled}
        {...otherProps}
      >
        {menuOptions}
      </SelectField>
    </View>
  );
}

let isChecked = (selectedValue: Value | Array<Value>, value: Value) => {
  if (Array.isArray(selectedValue)) {
    return selectedValue.includes(value);
  } else {
    return selectedValue === value;
  }
};

export default wrapComponent(Dropdown);

const styles = StyleSheet.create({
  outerContainer: {
    borderColor: MEDIUM_GREY,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 12,
    // paddingVertical: 4,
    // paddingHorizontal: 11,
    alignSelf: 'flex-start',
    width: DROPDOWN_DEFAULT_WIDTH + 2,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 4,
    height: 30,
    width: DROPDOWN_DEFAULT_WIDTH,
  },
  label: {
    color: DARK_GREY,
    fontSize: SMALL_FONT_SIZE,
    fontFamily: DEFAULT_FONT_FAMILY,
    top: 0,
    height: '30px',
    lineHeight: '30px',
  },
  icon: {
    width: 35,
    height: 30,
    padding: 0,
    zIndex: 0,
    top: 0,
  },
  menu: {
    marginTop: 0,
  },
  underline: {
    display: 'none',
  },
});
