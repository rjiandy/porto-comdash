// @flow

import React from 'react';
import {View} from '../coreUIComponents';
import {THEME_COLOR} from '../../constants/colors';

const DEFAULT_PIXEL = 10;
const DEFAULT_SIZE = 2;
const DEFAULT_BACKGROUND_COLOR = THEME_COLOR;

type Props = {
  size?: number;
  backgroundColor?: string;
};

export default function Rectangle(props: Props) {
  let {size, backgroundColor} = props;
  return (
    <View
      style={{
        backgroundColor: backgroundColor || DEFAULT_BACKGROUND_COLOR,
        width: (size || DEFAULT_SIZE) * DEFAULT_PIXEL,
        height: (size || DEFAULT_SIZE) * DEFAULT_PIXEL,
      }}
    />
  );
}
