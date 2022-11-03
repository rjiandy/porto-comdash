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
  reportList: Map<string, {id: string; name: string}>;

  values: UserGroup;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  toggleSideBar: (command: 'open' | 'close') => void;
};

export default class AssignedReportField extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let {values, errors, touched, toggleSideBar, reportList} = this.props;
    return (
      <View>
        <Text
          style={[
            multiSelectItemStyles.floatingLabel,
            errors.assignedReportList && touched.assignedReportList
              ? {color: 'red'}
              : null,
          ]}
        >
          ASSIGNED REPORT
        </Text>
        <View style={multiSelectItemStyles.field}>
          {values.assignedReportList.map((reportID, index) => {
            let report = reportList.get(reportID) || {name: ''};
            return (
              <View key={index} style={multiSelectItemStyles.tag}>
                <Tag
                  label={report.name}
                  icon="file"
                  iconStyle={{color: GREY}}
                  onRequestDelete={() => {
                    this._removeAssignedReport(reportID);
                  }}
                />
              </View>
            );
          })}
          <View style={multiSelectItemStyles.addTargetUserButton}>
            <Button
              secondary
              label="Assign Report"
              // onPress={this._addTargetUserFilter}
              onPress={() => toggleSideBar('open')}
              icon="add"
              iconPosition="left"
              iconStyle={StyleSheet.flatten(multiSelectItemStyles.iconButton)}
              style={StyleSheet.flatten(multiSelectItemStyles.button)}
            />
            <Text style={multiSelectItemStyles.errorText}>
              {errors.assignedReportList && touched.assignedReportList
                ? errors.assignedReportList
                : ''}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  _removeAssignedReport(id: string) {
    let {values, setFieldValue, setFieldTouched} = this.props;
    let oldValue = values['assignedReportList'];
    let selectedValues = [...oldValue];
    let removedIndex = selectedValues.indexOf(id);
    if (removedIndex > -1) {
      selectedValues.splice(removedIndex, 1);
    }
    setFieldValue('assignedReportList', selectedValues);
    setFieldTouched('assignedReportList', true);
  }
}
