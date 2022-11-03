// @flow

import React from 'react';
import {shallow} from 'enzyme';
import {Dropdown} from '../Dropdown';

it('should render the correct checked menu item in multiple dropdown', () => {
  let options = ['item 1', 'item 2', 'item 3'];
  let selectedValues = ['item 1', 'item 3'];
  let onSelect = jest.fn();
  let multipleDropdown = shallow(
    <Dropdown
      multiple
      label="test"
      selectedValue={selectedValues}
      onSelect={onSelect}
      options={options}
    />,
  );

  let menuItems = multipleDropdown.find('MenuItem');
  expect(menuItems.at(0).prop('checked')).toEqual(false);
  expect(menuItems.at(1).prop('checked')).toEqual(true);
  expect(menuItems.at(2).prop('checked')).toEqual(false);
  expect(menuItems.at(3).prop('checked')).toEqual(true);
});

it('should render the correct checked menu item in single dropdown', () => {
  let options = ['item 1', 'item 2', 'item 3'];
  let selectedValue = 'item 1';
  let onSelect = jest.fn();
  let dropdown = shallow(
    <Dropdown
      label="test"
      selectedValue={selectedValue}
      onSelect={onSelect}
      options={options}
    />,
  );

  let menuItems = dropdown.find('MenuItem');
  expect(menuItems.at(0).prop('checked')).toEqual(true);
  expect(menuItems.at(1).prop('checked')).toEqual(false);
  expect(menuItems.at(2).prop('checked')).toEqual(false);
});

it('should support option with different value in real value and label text', () => {
  let options = [
    {value: 1, text: 'item 1'},
    {value: 2, text: 'item 2'},
    {value: 3, text: 'item 3'},
  ];
  let selectedValue = 1;
  let onSelect = jest.fn();
  let dropdown = shallow(
    <Dropdown
      label="test"
      selectedValue={selectedValue}
      onSelect={onSelect}
      options={options}
    />,
  );

  let menuItems = dropdown.find('MenuItem');
  expect(menuItems.at(0).prop('checked')).toEqual(true);
  expect(menuItems.at(1).prop('checked')).toEqual(false);
  expect(menuItems.at(2).prop('checked')).toEqual(false);

  expect(menuItems.at(0).prop('value')).toEqual(1);
  expect(menuItems.at(0).prop('primaryText')).toEqual('item 1');
});
