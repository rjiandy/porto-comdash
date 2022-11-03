// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {DatePicker} from 'material-ui';
import {View, StyleSheet} from 'react-primitives';
import {Text} from '../coreUIComponents';
import {DataLabel} from '../UIComponents';

import formatDateTime from '../../helpers/formatDateTime';

type Props = {
  selectedDate: ?Date | string;
  onSelectedDateChange: (selectedDate: Date) => void;
  useISO?: boolean;
  placeholder?: string;
  type?: mixed;
  datePickerOtherProps?: {[key: string]: mixed};
  errorText?: string;
};

class DatePickerComponent extends Component {
  props: Props;
  _datePicker: any;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let {
      selectedDate,
      placeholder,
      datePickerOtherProps,
      errorText,
    } = this.props;
    let errorComponent;
    if (errorText) {
      errorComponent = <Text style={styles.errorText}>{errorText}</Text>;
    }

    let date =
      typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate;
    return (
      <DataLabel
        label={
          (selectedDate &&
            date &&
            formatDateTime(date.toISOString(), 'DATE')) ||
          placeholder ||
          ''
        }
        buttonIcon="calendar"
        onPress={this._openDatePickerDialog}
      >
        <View style={styles.hiddenContainer}>
          <DatePicker
            ref={(el) => (this._datePicker = el)}
            mode="landscape"
            autoOk={true}
            value={selectedDate}
            onChange={this._onDateChange}
            {...datePickerOtherProps}
          />
          {errorComponent}
        </View>
      </DataLabel>
    );
  }

  _onDateChange(event: Event, date: Date) {
    let {onSelectedDateChange, useISO} = this.props;
    if (onSelectedDateChange) {
      if (useISO === false) {
        onSelectedDateChange(date);
      } else {
        let utcDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
        );
        onSelectedDateChange(utcDate);
      }
    }
  }

  _openDatePickerDialog() {
    this._datePicker && this._datePicker.openDialog();
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  hiddenContainer: {
    width: 0,
    height: 0,
    position: 'absolute',
    overflow: 'hidden',
  },
  errorText: {
    paddingTop: 5,
    color: 'red',
    fontSize: 12,
    lineHeight: 12,
  },
  label: {
    marginRight: 15,
  },
});

export default DatePickerComponent;
