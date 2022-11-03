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
  userList: Map<string, {id: string; name: string}>;

  values: UserGroup;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  toggleSideBar: (command: 'open' | 'close') => void;
};

export default class MembersField extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let {values, errors, touched, toggleSideBar, userList} = this.props;
    return (
      <View>
        <Text
          style={[
            multiSelectItemStyles.floatingLabel,
            errors.memberList && touched.memberList ? {color: 'red'} : null,
          ]}
        >
          MEMBERS*
        </Text>
        <View style={multiSelectItemStyles.field}>
          {values.memberList.map((memberID, index) => {
            let member = userList.get(memberID) || {name: ''};
            return (
              <View key={index} style={multiSelectItemStyles.tag}>
                <Tag
                  label={member.name}
                  icon="user"
                  iconStyle={{color: GREY}}
                  onRequestDelete={() => {
                    this._removeMember(memberID);
                  }}
                />
              </View>
            );
          })}
          <View style={multiSelectItemStyles.addTargetUserButton}>
            <Button
              secondary
              label="Add Member"
              // onPress={this._addTargetUserFilter}
              onPress={() => toggleSideBar('open')}
              icon="add"
              iconPosition="left"
              iconStyle={StyleSheet.flatten(multiSelectItemStyles.iconButton)}
              style={StyleSheet.flatten(multiSelectItemStyles.button)}
            />
            {errors.memberList && touched.memberList ? (
              <Text style={multiSelectItemStyles.errorText}>
                {errors.memberList}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  _removeMember(id: string) {
    let {values, setFieldValue, setFieldTouched} = this.props;
    let oldValue = values['memberList'];
    let selectedValues = [...oldValue];
    let removedIndex = selectedValues.indexOf(id);
    if (removedIndex > -1) {
      selectedValues.splice(removedIndex, 1);
    }
    setFieldValue('memberList', selectedValues);
    setFieldTouched('memberList', true);
  }
}
