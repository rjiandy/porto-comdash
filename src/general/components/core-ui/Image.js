// @flow

import React from 'react';
import {Image} from 'react-primitives';

type Props = {[key: string]: mixed};

export default function ImageComponent(props: Props) {
  return (
    <Image {...props} />
  );
}
