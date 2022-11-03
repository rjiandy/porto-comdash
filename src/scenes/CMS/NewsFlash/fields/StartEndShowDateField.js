// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';

import {
  View,
  Text,
  DatePicker,
} from '../../../../general/components/coreUIComponents';
import {TEXT_COLOR} from '../../../../general/constants/colors';
import {SMALL_FONT_SIZE} from '../../../../general/constants/text';
import formatDateTime from '../../../../general/helpers/formatDateTime';

import type {NewsFlash} from '../NewsFlash-type';

type Props = {
  values: NewsFlash;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
};

export default class StartEndShowDateField extends Component {
  props: Props;
  render() {
    let {values, errors, touched} = this.props;
    return (
      <View style={styles.root}>
        <View style={styles.rowComponent}>
          <Text
            style={[
              styles.floatingLabel,
              errors.startingTime && touched.startingTime ? {color: 'red'} : {},
            ]}
          >
            START SHOW DATE
          </Text>
          <DatePicker
            placeholder="Pick a date"
            selectedDate={values.startingTime}
            onSelectedDateChange={(newSelectedDate) => {
              let now = new Date();
              let getDateNow = formatDateTime(new Date().toUTCString(), 'DATE');
              let getSelectedDate = formatDateTime(
                newSelectedDate.toUTCString(),
                'DATE',
              );
              this._onDateFieldChange(
                'startingTime',
                getDateNow === getSelectedDate ? now : newSelectedDate,
              );
            }}
            errorText={
              errors.startingTime && touched.startingTime
                ? errors.startingTime
                : ''
            }
          />
          <Text style={styles.errorText}>
            {errors.startingTime && touched.startingTime
              ? errors.startingTime
              : ''}
          </Text>
        </View>
        <View style={styles.rowComponent}>
          <Text
            style={[
              styles.floatingLabel,
              errors.endingTime && touched.endingTime ? {color: 'red'} : {},
            ]}
          >
            END SHOW DATE
          </Text>
          <DatePicker
            placeholder="Pick a date"
            selectedDate={values.endingTime}
            onSelectedDateChange={(newSelectedDate) =>
              this._onDateFieldChange('endingTime', newSelectedDate)}
            errorText={
              errors.endingTime && touched.endingTime ? errors.endingTime : ''
            }
          />
          <Text style={styles.errorText}>
            {errors.endingTime && touched.endingTime ? errors.endingTime : ''}
          </Text>
        </View>
      </View>
    );
  }
  _onDateFieldChange(field: string, newSelectedDate: Date) {
    let {setFieldValue, setFieldTouched} = this.props;
    setFieldValue(field, newSelectedDate);
    setFieldTouched(field, true);
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  rowComponent: {
    marginRight: 20,
  },
  floatingLabel: {
    fontSize: 12,
    lineHeight: 22,
    pointerEvents: 'none',
    userSelect: 'none',
    color: TEXT_COLOR,
    marginBottom: 3,
  },
  errorText: {
    fontSize: SMALL_FONT_SIZE,
    lineHeight: 12,
    color: 'rgb(244, 67, 54)',
    marginTop: 5,
    maxWidth: 200,
    paddingLeft: 15,
  },
});
