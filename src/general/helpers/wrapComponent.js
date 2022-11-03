// @flow
import React from 'react';
import {StyleSheet} from 'react-primitives';

type Props = {
  style?: number | Array<number> | Object;
};

export default function wrapComponent(Component: ReactClass<*>) {
  let WrappedComponent = (props: Props) => {
    let {style, ...otherProps} = props;
    let newStyle;
    if (style) {
      if (typeof style === Object) {
        newStyle = style;
      } else {
        newStyle = StyleSheet.flatten(style);
      }
    }
    return <Component {...otherProps} style={newStyle} />;
  };
  WrappedComponent.displayName = Component.displayName || Component.name;
  return WrappedComponent;
}
