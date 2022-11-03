// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {View} from '../coreUIComponents';
import {THEME_COLOR} from '../../constants/colors';

const MULTIPLIER = 5;
const DEFAULT_SIZE = 2;
const DEFAULT_BACKGROUND_COLOR = THEME_COLOR;
// This ratio (1.732) will form an Equilateral Triangle, but a flatter
// triangle looks more appealing in this UI.
// const RATIO = Math.sqrt(3).toFixed(3);
const RATIO = 1.2;

type Props = {
  orientation?: 'up' | 'down' | 'left' | 'right';
  size?: number;
  color?: string;
};

export default function Triangle(props: Props) {
  let {size, orientation, color} = props;
  let borderSide = getBorderSide(orientation);
  let xy = getXY(orientation);
  let px = (size || DEFAULT_SIZE) * MULTIPLIER;
  let additionalStyles = {
    borderWidth: px,
    [`${borderSide}Color`]: color || DEFAULT_BACKGROUND_COLOR,
    transform: `scale${xy}(${RATIO}) translate${xy}(${String(px / 2)}px)`,
  };
  return <View style={[styles.triangle, additionalStyles]} />;
}

function getXY(orientation) {
  if (orientation === 'left' || orientation === 'right') {
    return 'X';
  }
  return 'Y';
}

function getBorderSide(orientation) {
  switch (orientation) {
    case 'left': {
      return 'borderRight';
    }
    case 'right': {
      return 'borderLeft';
    }
    case 'down': {
      return 'borderTop';
    }
    default: {
      return 'borderBottom';
    }
  }
}

let styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
