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
import {GREY, TEXT_COLOR} from '../../../../general/constants/colors';
import {SMALL_FONT_SIZE} from '../../../../general/constants/text';

import type {NewsFlash} from '../NewsFlash-type';
import type {GroupMetadata} from '../../UserGroup/UserGroup-type';

type Props = {
  values: NewsFlash;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  toggleAddGroupSidebar: (command?: 'open' | 'close') => void;
};

export default class TargetUserGroupField extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let {values, errors, touched, toggleAddGroupSidebar} = this.props;
    return (
      <View>
        <Text
          style={[
            styles.floatingLabel,
            errors.groups && touched.groups ? {color: 'red'} : null,
          ]}
        >
          TARGET USER GROUP
        </Text>
        <View style={styles.field}>
          {values.groups.map((group, index) => {
            return (
              <View key={index} style={styles.tag}>
                <Tag
                  label={group.groupName}
                  icon="group"
                  iconStyle={{color: GREY}}
                  onRequestDelete={() => {
                    this._removeTargetUserFilter(group);
                  }}
                />
              </View>
            );
          })}
          <View style={styles.addTargetUserButton}>
            <Button
              secondary
              label="Add User Group"
              // onPress={this._addTargetUserFilter}
              onPress={() => toggleAddGroupSidebar('open')}
              icon="add"
              iconPosition="left"
              iconStyle={StyleSheet.flatten(styles.iconButton)}
              style={StyleSheet.flatten(styles.button)}
            />
            <Text style={styles.errorText}>
              {errors.groups && touched.groups ? errors.groups : ''}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  _removeTargetUserFilter(removeValue: GroupMetadata) {
    let {values, setFieldValue, setFieldTouched} = this.props;
    let newSelectedValues = values['groups'].filter((group) => {
      return group.id !== removeValue.id;
    });
    setFieldValue('groups', newSelectedValues);
    setFieldTouched('groups', true);
  }
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    justifyContent: 'center',
    marginRight: 20,
    marginBottom: 15,
  },
  addTargetUserButton: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingTop: 5,
  },
  floatingLabel: {
    fontSize: 12,
    lineHeight: 22,
    pointerEvents: 'none',
    userSelect: 'none',
    color: TEXT_COLOR,
    marginBottom: 3,
  },
  button: {
    height: 42,
  },
  iconButton: {
    fontSize: 18,
    paddingBottom: 2,
  },
  errorText: {
    fontSize: SMALL_FONT_SIZE,
    lineHeight: 12,
    color: 'rgb(244, 67, 54)',
    marginTop: 5,
    paddingLeft: 15,
  },
});
