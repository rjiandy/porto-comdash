// @flow

import React from 'react';
import {TextField} from 'material-ui';
import {MaterialIcon} from '../coreUIComponents';
import {DataLabel} from '../UIComponents';
import wrapComponent from '../../helpers/wrapComponent';
import View from './View';
import {DEFAULT_FONT_SIZE} from '../../constants/text';
import {TEXT_COLOR, MEDIUM_GREY} from '../../constants/colors';

type Props = {
  id: string;
  value: string;
  onTextChange: (newText: string) => void;
  errorText?: string;
  errorStyle?: {[key: string]: string | number};
  hintStyle?: {[key: string]: string | number};
  rows?: number;
  rowsMax?: number;
  placeholder?: string;
  multiline?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconStyle?: {[key: string]: string | number};
  containerStyle?: {[key: string]: string | number};
  wrapWithDataLabel?: boolean;
};

const DEFAULT_MAX_MULTILINE_ROW = 3;

export function TextInput(props: Props) {
  let {
    value,
    onTextChange,
    errorText,
    errorStyle,
    placeholder,
    multiline,
    fullWidth,
    icon,
    iconStyle,
    containerStyle,
    hintStyle,
    wrapWithDataLabel,
    ...otherProps
  } = props;

  let onChange = (event: Event, newValue: string) => {
    if (onTextChange) {
      onTextChange(newValue);
    }
  };

  let multilineProps = {};
  if (multiline) {
    multilineProps = {
      multiLine: true,
      rowsMax: DEFAULT_MAX_MULTILINE_ROW,
    };
  }

  let Wrapper = DataLabel;

  if (wrapWithDataLabel === false) {
    Wrapper = View;
  }

  return (
    <Wrapper
      style={[
        styles.container,
        fullWidth ? {flex: 1, alignSelf: 'stretch'} : null,
        containerStyle,
      ]}
    >
      <TextField
        hintText={placeholder}
        value={value}
        onChange={onChange}
        errorText={errorText || ''}
        errorStyle={{...styles.textError, ...errorStyle}}
        underlineShow={false}
        fullWidth
        hintStyle={{...styles.textHint, ...hintStyle}}
        inputStyle={styles.textInput}
        textareaStyle={styles.textInput}
        className="text-input-text-field"
        style={styles.textField}
        {...multilineProps}
        {...otherProps}
      />
      {icon ? <MaterialIcon name={icon} style={iconStyle || {}} /> : null}
    </Wrapper>
  );
}

export default wrapComponent(TextInput);

const textStyle = {
  fontSize: DEFAULT_FONT_SIZE,
  color: TEXT_COLOR,
  letterSpacing: 0.1,
};

const PADDING = 15;

const styles = {
  container: {},
  textField: {
    // This seems to be ignored.
  },
  textInput: {
    ...textStyle,
    paddingLeft: PADDING,
    paddingRight: PADDING,
    boxSizing: 'border-box',
  },
  textHint: {
    ...textStyle,
    left: PADDING,
    color: MEDIUM_GREY,
    // This is because we reduced the height of all text inputs from 48 to 38.
    bottom: 7,
  },
  textError: {
    // This is because we reduced the height of all text inputs from 48 to 38.
    bottom: -3,
    paddingLeft: 3,
  },
};
