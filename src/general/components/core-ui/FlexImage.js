// @flow
import React from 'react';
import {View, StyleSheet} from 'react-primitives';

type Props = {
  style?: StyleSheetTypes;
  source: string | Image;
  alt?: string;
};

let _imgStyle;

export default function FlexImage(props: Props) {
  let {style, source, alt, ...otherProps} = props;
  let imgStyle = _imgStyle || (_imgStyle = StyleSheet.flatten(styles.img));
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <img style={imgStyle} src={source} alt={alt || ''} />
    </View>
  );
}

let styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  img: {
    display: 'block',
    width: '100%',
    height: 'auto',
    maxHeight: '100%',
    borderWidth: 0,
  },
});
