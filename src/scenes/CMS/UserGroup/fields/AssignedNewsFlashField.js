// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {StyleSheet} from 'react-primitives';
import {
  View,
  Tag,
  Button,
  Text,
} from '../../../../general/components/coreUIComponents';
import {GREY} from '../../../../general/constants/colors';

import multiSelectItemStyles from '../../MultiSelectItem-style';

type UserGroup = any;

type Props = {
  // TODO: get this type from redux
  newsFlashList: Map<string, {id: string; name: string}>;
  values: UserGroup;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  toggleSideBar: (command: 'open' | 'close') => void;
};

export default class AssignedNewsFlashField extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let {values, errors, touched, toggleSideBar, newsFlashList} = this.props;
    return (
      <View>
        <Text
          style={[
            multiSelectItemStyles.floatingLabel,
            errors.assignedNewsFlashList && touched.assignedNewsFlashList
              ? {color: 'red'}
              : null,
          ]}
        >
          ASSIGNED NEWS FLASH
        </Text>
        <View style={multiSelectItemStyles.field}>
          {values.assignedNewsFlashList.map((newsFlashID, index) => {
            let newsFlash = newsFlashList.get(newsFlashID) || {name: ''};
            return (
              <View key={index} style={multiSelectItemStyles.tag}>
                <Tag
                  label={newsFlash.name}
                  icon="newsflash"
                  iconStyle={{color: GREY}}
                  onRequestDelete={() => {
                    this._removeAssignedNewsFlash(newsFlashID);
                  }}
                />
              </View>
            );
          })}
          <View style={multiSelectItemStyles.addTargetUserButton}>
            <Button
              secondary
              label="Assign News Flash"
              // onPress={this._addTargetUserFilter}
              onPress={() => toggleSideBar('open')}
              icon="add"
              iconPosition="left"
              iconStyle={StyleSheet.flatten(multiSelectItemStyles.iconButton)}
              style={StyleSheet.flatten(multiSelectItemStyles.button)}
            />
            <Text style={multiSelectItemStyles.errorText}>
              {errors.assignedNewsFlashList && touched.assignedNewsFlashList
                ? errors.assignedNewsFlashList
                : ''}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  _removeAssignedNewsFlash(id: string) {
    let {values, setFieldValue, setFieldTouched} = this.props;
    let oldValue = values['assignedNewsFlashList'];
    let selectedValues = [...oldValue];
    let removedIndex = selectedValues.indexOf(id);
    if (removedIndex > -1) {
      selectedValues.splice(removedIndex, 1);
    }
    setFieldValue('assignedNewsFlashList', selectedValues);
    setFieldTouched('assignedNewsFlashList', true);
  }
}
