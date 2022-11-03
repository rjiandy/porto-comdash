// @flow
import React from 'react';
import {View, StyleSheet} from 'react-primitives';

type Props = {
  style?: StyleSheetTypes;
  ratio: number;
  children: mixed;
};

export default function FixedRatioView(props: Props) {
  let {style, ratio, children, ...otherProps} = props;
  let paddingBottom = `${String(1 / ratio * 100)}%`;
  return (
    <View style={style} {...otherProps}>
      <div><div style={{paddingBottom}} /></div>
      <View style={styles.inner}>
        {children}
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  inner: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
