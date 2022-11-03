// @flow

import React from 'react';
import {DataLabel} from '../UIComponents';
import {ALTERNATIVE_GREY} from '../../constants/colors';

type Props = {
  label: string;
  icon?: string;
  onRequestDelete?: () => void;
  disabled?: boolean;
};

export default function Tag(props: Props) {
  let {label, icon, onRequestDelete, disabled} = props;
  return (
    <DataLabel
      textIcon={icon}
      label={label}
      buttonIcon={disabled ? null : icon && 'close'}
      buttonIconColor="grey"
      onIconPress={onRequestDelete}
      style={disabled ? styles.disabled : {}}
    />
  );
}

const styles = {
  disabled: {
    backgroundColor: ALTERNATIVE_GREY,
    cursor: 'not-allowed',
  },
};
