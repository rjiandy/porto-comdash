// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {Toggle} from 'material-ui';
import {View, Text} from '../coreUIComponents';
import {PALE_GREY, THEME_COLOR, LIGHT_BLUE} from '../../constants/colors';
import {DEFAULT_FONT_FAMILY, SMALL_FONT_SIZE} from '../../constants/text';

type Props = {
  label: string | {label1: string; label2: string};
  value?: boolean;
  onToggle?: () => void;
  labelStyle?: {[key: string]: string | number} | number;
  style?: {[key: string]: string | number};
};

export default function ToggleSwitch(props: Props) {
  let {label, value, onToggle, labelStyle, style} = props;
  let isSwitchBoolean = typeof label === 'string';
  let labelPosition = isSwitchBoolean ? {labelPosition: 'right'} : {};
  return (
    <View style={[styles.container, style]}>
      {isSwitchBoolean
        ? null
        : <Text customStyle="small" style={labelStyle}>
            {label.label1 ? label.label1 : ''}
          </Text>}
      <View>
        <Toggle
          toggled={value ? value : false}
          onToggle={onToggle ? onToggle : () => {}}
          style={isSwitchBoolean ? {} : StyleSheet.flatten(styles.toggle)}
          label={isSwitchBoolean ? label : null}
          {...labelPosition}
          labelStyle={StyleSheet.flatten([
            styles.label,
            labelStyle && StyleSheet.flatten(labelStyle),
          ])}
          thumbStyle={StyleSheet.flatten([
            styles.thumb,
            isSwitchBoolean ? null : {backgroundColor: THEME_COLOR},
          ])}
          trackStyle={StyleSheet.flatten([
            styles.track,
            {backgroundColor: PALE_GREY},
          ])}
          thumbSwitchedStyle={StyleSheet.flatten([
            styles.thumb,
            {backgroundColor: THEME_COLOR},
          ])}
          trackSwitchedStyle={StyleSheet.flatten([
            styles.track,
            isSwitchBoolean
              ? {backgroundColor: LIGHT_BLUE}
              : {backgroundColor: PALE_GREY},
          ])}
        />
      </View>
      {isSwitchBoolean
        ? null
        : <Text customStyle="small" style={labelStyle}>
            {label.label2 ? label.label2 : ''}
          </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  toggle: {
    marginLeft: 7,
    marginRight: 15,
  },
  thumb: {
    top: 5,
  },
  track: {
    height: 22,
  },
  label: {
    top: 4,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: SMALL_FONT_SIZE,
    marginRight: 8,
  },
});
