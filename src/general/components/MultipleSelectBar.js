// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {
  View,
  Text,
  Button,
  MaterialIcon,
} from '../../general/components/coreUIComponents';
import {PALE_GREY, GREY, colorStyles} from '../../general/constants/colors';

type ButtonType = {
  name: string;
  onPress: () => void;
  props?: any;
  type?: 'primary' | 'secondary' | 'cancel';
  icon?: string;
};

type Props = {
  isShown?: boolean;
  selectedItemsQty: number;
  item: 'report' | 'newsflash' | 'help' | 'user' | 'group';
  buttons: Array<ButtonType>;
};

export default function MultipleSelectBar(props: Props) {
  let {isShown, selectedItemsQty, item, buttons} = props;
  return selectedItemsQty || isShown ? (
    <View style={styles.fixed}>
      <View style={[styles.container, colorStyles.thickShadow]}>
        <Text>
          {selectedItemsQty
            ? selectedItemsQty +
              ' ' +
              item +
              (item === 'newsflash' ? 'es' : 's') +
              ' selected'
            : ''}
        </Text>
        {buttons.map((button, index) => {
          if (button.type === 'cancel') {
            return (
              <MaterialIcon
                name="close"
                style={{color: GREY}}
                onPress={button.onPress}
                {...button.props}
              />
            );
          }
          let {type, icon} = button;
          let buttonProps;
          switch (type) {
            case 'primary': {
              buttonProps = {
                primary: true,
              };
              break;
            }
            case 'secondary': {
              buttonProps = {
                secondary: true,
              };
              break;
            }
            default: {
              buttonProps = {};
            }
          }
          if (icon) {
            buttonProps = {
              ...buttonProps,
              icon,
            };
          }
          return (
            <Button
              key={index}
              label={button.name}
              style={styles.button}
              onPress={button.onPress}
              {...buttonProps}
            />
          );
        })}
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  fixed: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    height: 45,
    zIndex: 20,
  },
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    backgroundColor: PALE_GREY,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },
  button: {
    marginLeft: 15,
    height: 30,
    lineHeight: 0,
  },
});
