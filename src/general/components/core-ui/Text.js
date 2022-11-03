// @flow

import React from 'react';
import {Text, StyleSheet} from 'react-primitives';
import {TEXT_COLOR, TITLE_TEXT_COLOR} from '../../constants/colors';
import {
  DEFAULT_FONT_FAMILY,
  ALTERNATIVE_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  TITLE_FONT_SIZE,
  HEADER_FONT_SIZE,
  SMALL_FONT_SIZE,
} from '../../constants/text';

type Props = {
  children: React$Element<*>;
  style?: StyleSheet.Style;
  fontFamily?: string;
  fontWeight?: 'light' | 'bold';
  customStyle?: 'title' | 'header' | 'small';
};

export default function TextComponent(props: Props) {
  let {
    children,
    style,
    fontWeight,
    fontFamily,
    customStyle,
    ...otherProps
  } = props;
  let weight;
  switch (fontWeight) {
    case 'light':
      weight = {fontWeight: '200'};
      break;
    case 'bold':
      weight = {fontWeight: '600'};
      break;
    default:
      break;
  }
  let customStyles;
  switch (customStyle) {
    case 'title':
      customStyles = styles.title;
      break;
    case 'header':
      customStyles = styles.header;
      break;
    case 'small':
      customStyles = styles.small;
      break;
    default:
      customStyles = styles.default;
  }
  let typeFace = null;
  if (fontFamily) {
    typeFace = {fontFamily};
  } else if (customStyle == null) {
    typeFace = {fontFamily: DEFAULT_FONT_FAMILY};
  }
  return (
    <Text style={[customStyles, style, weight, typeFace]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: DEFAULT_FONT_SIZE,
    color: TEXT_COLOR,
    letterSpacing: 0.1,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    color: TITLE_TEXT_COLOR,
    fontFamily: ALTERNATIVE_FONT_FAMILY,
    fontWeight: '200',
    letterSpacing: 0.7,
  },
  header: {
    fontSize: HEADER_FONT_SIZE,
    color: TEXT_COLOR,
    fontFamily: ALTERNATIVE_FONT_FAMILY,
    letterSpacing: 0.1,
  },
  small: {
    fontSize: SMALL_FONT_SIZE,
    color: TEXT_COLOR,
    letterSpacing: 0.1,
  },
});
