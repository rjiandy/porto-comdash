// @flow

import React from 'react';
import {StyleSheet, View} from 'react-primitives';
import {CircularProgress as LoadingIndicator} from 'material-ui';

import {THEME_COLOR} from '../../constants/colors.js';

type Props = {
  size?: number;
  color?: string;
  thickness?: number;
  containerStyle?: StyleSheetTypes;
};

export default function LoadingComponent(props: Props) {
  let {size, color, thickness, containerStyle, ...others} = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <LoadingIndicator
        color={color ? color : THEME_COLOR}
        size={size ? size : 54}
        thickness={thickness ? thickness : 6}
        {...others}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
  },
});
