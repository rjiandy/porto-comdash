// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, TextInput, Icon, MaterialIcon} from './coreUIComponents';
import {DEFAULT_FONT_SIZE} from '../constants/text';
import {TEXT_COLOR, MEDIUM_GREY} from '../constants/colors';

type Props = {
  value: string;
  onTextChange: (newText: string) => void;
  icon?: string;
  iconType?: 'custom' | 'material';
  placeholder?: string;
  renderTextField?: boolean;
  containerStyle?: StyleSheetTypes;
  onIconPress?: () => void;
};

export default function SearchTextField(props: Props) {
  let {
    value,
    onTextChange,
    icon,
    iconType,
    renderTextField,
    onIconPress,
    placeholder,
    containerStyle,
  } = props;

  let IconComponent = iconType === 'material' ? MaterialIcon : Icon;
  return (
    <View
      style={[
        styles.root,
        onIconPress ? {paddingRight: 10} : {paddingHorizontal: 10},
        containerStyle,
      ]}
    >
      {icon ? <IconComponent name={icon} onPress={onIconPress} /> : null}
      {renderTextField === false ? null : (
        <TextInput
          wrapWithDataLabel={false}
          placeholder={placeholder}
          onTextChange={onTextChange}
          underlineShow={false}
          value={value}
          style={{marginLeft: onIconPress ? 0 : 10}}
          inputStyle={{
            fontSize: DEFAULT_FONT_SIZE,
            color: TEXT_COLOR,
            paddingLeft: 0,
          }}
          hintStyle={{
            fontSize: DEFAULT_FONT_SIZE,
            left: 0,
            color: MEDIUM_GREY,
            bottom: 12,
            letterSpacing: 0.1,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
