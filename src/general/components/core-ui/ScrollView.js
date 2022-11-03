// @flow
import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View} from '../coreUIComponents';

type Props = {
  padding?: number;
  style?: StyleSheetTypes;
  children?: mixed;
  setRef?: (node: React$Element<*>) => void;
};

function ScrollView(props: Props) {
  let {style, padding, setRef, ...otherProps} = props;
  let innerStyle;
  if (padding != null) {
    innerStyle = {padding};
  }
  return (
    <View
      ref={(node) => {
        setRef && setRef(node);
      }}
      style={[styles.scrollView, style]}
    >
      <View style={innerStyle} {...otherProps} />
    </View>
  );
}

let styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    overflowY: 'scroll',
  },
});

export default ScrollView;
