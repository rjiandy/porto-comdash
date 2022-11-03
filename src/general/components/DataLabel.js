// @flow

import React from 'react';
import {StyleSheet, Touchable} from 'react-primitives';
import {View, Text, Icon} from './coreUIComponents';
import {GREY, LIGHT_GREY, BACKGROUND, THEME_COLOR} from './../constants/colors';

type Props = {
  label?: string;
  textIcon?: string;
  buttonIcon?: ?string;
  buttonIconColor?: 'blue' | 'grey';
  onIconPress?: () => void;
  onPress?: () => void;
  children?: React$Element<*>;
  style?: StyleSheet.Style;
};

export default function DataLabel(props: Props) {
  let {
    label,
    textIcon,
    buttonIcon,
    buttonIconColor,
    onPress,
    onIconPress,
    children,
    style,
  } = props;
  return (
    <Touchable onPress={onPress}>
      <View style={[styles.container, style]}>
        {textIcon ? (
          <Icon
            name={textIcon}
            color="blue"
            style={StyleSheet.flatten({marginLeft: 15})}
          />
        ) : null}
        {label ? (
          <Text customStyle="small" style={styles.text}>
            {label}
          </Text>
        ) : null}
        {buttonIcon ? (
          <Touchable onPress={onPress || onIconPress}>
            <View style={styles.button}>
              <Icon
                name={buttonIcon}
                color={buttonIconColor}
                style={buttonIcon === 'close' ? {height: 12, width: 12} : null}
              />
            </View>
          </Touchable>
        ) : null}
        {children ? children : null}
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    marginHorizontal: 15,
  },
  button: {
    height: 40,
    width: 40,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    borderLeftWidth: 1,
    borderLeftColor: LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND,
    paddingRight: 2,
  },
  blueIcon: {
    color: THEME_COLOR,
    fontSize: 18,
  },
  greyIcon: {
    color: GREY,
    fontSize: 18,
  },
});
