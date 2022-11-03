// @flow

import React from 'react';

import {StyleSheet, Touchable} from 'react-primitives';

import {View, Icon} from '../../../general/components/coreUIComponents';

type Props = {
  disabled: boolean;
  openExportDialog: () => void;
};

export default function ExportButton(props: Props) {
  let {openExportDialog, disabled} = props;
  return (
    <Touchable
      onPress={() => {
        !disabled && openExportDialog();
      }}
    >
      <View style={{marginRight: 30}}>
        <Icon
          name="export"
          color={disabled ? 'grey' : 'blue'}
          style={styles.button}
        />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 25,
    minWidth: 25,
  },
});
