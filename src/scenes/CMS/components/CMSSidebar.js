// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {View, Text, Button} from '../../../general/components/coreUIComponents';
// import {DataLabel} from '../../../general/components/UIComponents';
import {THEME_COLOR, GREY} from '../../../general/constants/colors';

type Props = {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  onSave?: () => void; // don't need this if we are using form
  onCancelPress?: () => void;
  saveButtonProps?: any;
  cancelButtonProps?: any;
  style?: StyleSheetTypes;
  isSaveDisabled?: boolean;
};

export default function AddGroupSidebar(props: Props) {
  let {
    isOpen,
    title,
    children,
    onSave,
    saveButtonProps,
    cancelButtonProps,
    onCancelPress,
    isSaveDisabled,
    style,
  } = props;
  return isOpen ? (
    <View style={[styles.container, style]}>
      <Text customStyle="title" style={styles.sideBarTitle}>
        {title}
      </Text>
      <View style={styles.separatorBar} />
      {children}
    </View>
  ) : (
    <View style={[styles.container, style]}>
      <Button
        primary
        label="Save"
        fullWidth
        onPress={onSave}
        style={{marginBottom: 10}}
        {...saveButtonProps}
        backgroundColor={isSaveDisabled ? GREY : THEME_COLOR}
        disabled={isSaveDisabled}
      />
      <Button
        style={{marginBottom: 10}}
        secondary
        label="Cancel"
        fullWidth
        onPress={onCancelPress}
        {...cancelButtonProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    maxWidth: 260, // weird behaviour because it keeps growing
    minWidth: 260,
    flex: 1,
    padding: 20,
    paddingBottom: 12,
    borderLeftWidth: 1,
    borderColor: '#D0DAE3',
  },
  sideBarTitle: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  separatorBar: {
    height: 3,
    backgroundColor: THEME_COLOR,
    borderRadius: 2,
    marginBottom: 10,
    marginHorizontal: 10,
  },
});
