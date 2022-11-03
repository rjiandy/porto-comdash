// @flow

import React from 'react';
import {View} from 'react-primitives';

type Props = {[key: string]: mixed};

export default function Form(props: Props) {
  return <View accessibilityRole="form" {...props} />;
}
