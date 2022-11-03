// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, Text} from './coreUIComponents';
import {DROPDOWN_DEFAULT_WIDTH} from './core-ui/Dropdown';
import {DEFAULT_FONT_FAMILY, SMALL_FONT_SIZE} from '../constants/text';
import {MEDIUM_GREY, PLACEHOLDER_TEXT_COLOR} from '../constants/colors';

type Props = {
  label: string;
  value: string;
};

export default function GlobalFilterPlaceholder(props: Props) {
  let {label, value} = props;
  return (
    <View style={styles.root}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: DROPDOWN_DEFAULT_WIDTH,
  },
  labelText: {
    fontSize: 11,
    fontFamily: DEFAULT_FONT_FAMILY,
    transform: [{scale: 0.75}, {translateY: -5}, {translateX: -8}],
    color: PLACEHOLDER_TEXT_COLOR,
  },
  valueContainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: MEDIUM_GREY,
    height: 30,
    paddingTop: 8,
    paddingBottom: 9,
    paddingHorizontal: 10,
    transform: [{translateY: -1}],
  },
  value: {
    fontSize: SMALL_FONT_SIZE,
  },
});
