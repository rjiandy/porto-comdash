// @flow

import React from 'react';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';
// import renderer from 'react-test-renderer';

import MultiSelectItemSidebar from '../MultiSelectItemSidebar';

jest.mock('../../../../general/components/coreUIComponents', () => ({
  Button: 'Button',
  View: 'View',
  TextInput: 'TextInput',
  ScrollView: 'ScrollView',
}));
jest.mock('material-ui', () => ({
  Checkbox: 'Checkbox',
}));
jest.mock('react-primitives', () => ({
  Touchable: 'Touchable',
  StyleSheet: {
    create: () => {},
    flatten: () => {},
  },
}));

it('should render a Multi Selection Item Sidebar with correct props', () => {
  let itemList = [
    {id: 'item1', name: 'item 1'},
    {id: 'item2', name: 'item 2'},
    {id: 'item3', name: 'item 3'},
  ];
  let selectedItems = ['item1'];
  let toggleSidebar = jest.fn();
  let onConfirm = jest.fn((newSelectedItems) => newSelectedItems);
  let component = shallow(
    <MultiSelectItemSidebar
      id="id"
      noItemFound="no item found"
      searchPlaceholder="search"
      itemList={itemList}
      selectedItems={selectedItems}
      onConfirm={onConfirm}
      toggleSidebar={toggleSidebar}
    />
  );
  expect(toJSON(component)).toMatchSnapshot();
});

it('should render a Multi Selection Item Sidebar with add data button', () => {
  let itemList = [
    {id: 'item1', name: 'item 1'},
    {id: 'item2', name: 'item 2'},
    {id: 'item3', name: 'item 3'},
  ];
  let selectedItems = ['item1'];
  let toggleSidebar = jest.fn();
  let onAddData = jest.fn();
  let onConfirm = jest.fn((newSelectedItems) => newSelectedItems);
  let component = shallow(
    <MultiSelectItemSidebar
      id="id"
      noItemFound="no item found"
      searchPlaceholder="search"
      itemList={itemList}
      selectedItems={selectedItems}
      onConfirm={onConfirm}
      toggleSidebar={toggleSidebar}
      addDataButtonLabel="Add More Data"
      onAddData={onAddData}
    />
  );
  expect(toJSON(component)).toMatchSnapshot();
});
