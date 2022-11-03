// @flow

import React from 'react';

import {Text} from '../../../general/components/coreUIComponents';

type Props = {
  children: any;
  style?: StyleSheetTypes;
  total?: boolean;
};

export default function EnhancedText(props: Props) {
  let {children, total, style, ...others} = props;
  let displayText = children.toString();
  displayText = displayText.split('-')[1]
    ? displayText.split('-')[1]
    : displayText;
  return total ? (
    <Text style={[{color: children < 0 ? 'red' : 'black'}, style]} {...others}>
      {displayText}
    </Text>
  ) : (
    <Text
      customStyle="small"
      style={[{color: children < 0 ? 'red' : 'black'}, style]}
      {...others}
    >
      {displayText}
    </Text>
  );
}
