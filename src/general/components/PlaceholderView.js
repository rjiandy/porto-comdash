// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, Text} from './coreUIComponents';

type Props = {
  text?: string;
  style?: StyleSheetTypes;
  textStyle?: StyleSheetTypes;
};

// TODO: we can improve this by adding icon
export default function PlaceholderView(props: Props) {
  let {text, style, textStyle, ...otherProps} = props;
  return (
    <View style={[styles.placeholder, style]} {...otherProps}>
      {text ? <Text style={[styles.text, textStyle]}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#EDF4FB',
    borderColor: '#88B7EE',
    borderStyle: 'dashed',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    color: '#4A90E2',
    textAlign: 'center',
  },
});
