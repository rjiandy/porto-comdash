// @flow

import React from 'react';
import {
  View,
  Text,
  TextInput,
} from '../../../../general/components/coreUIComponents';
import {
  TEXT_COLOR,
  PLACEHOLDER_TEXT_COLOR,
} from '../../../../general/constants/colors';
import {
  SMALL_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
} from '../../../../general/constants/text';

import type {HelpLink} from '../HelpLink-type';

type Props = {
  values: HelpLink;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  handleBlur: () => void;
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
};

export default function LinkField(props: Props) {
  let {values, handleBlur, errors, touched, setFieldValue} = props;

  let onChangeHandler = (newValue: string) => {
    setFieldValue('linkUrl', newValue);
  };
  return (
    <View>
      <Text
        style={[
          styles.floatingLabel,
          errors.linkUrl && touched.linkUrl ? {color: 'red'} : null,
        ]}
      >
        LINK URL
      </Text>
      <TextInput
        id="linkUrl"
        fullWidth
        value={values.linkUrl}
        onTextChange={onChangeHandler}
        onBlur={handleBlur}
        errorText={errors.linkUrl && touched.linkUrl ? errors.linkUrl : ''}
        errorStyle={styles.errorText}
        hintText="Help Link URL"
        hintStyle={styles.hintText}
      />
    </View>
  );
}

const styles = {
  floatingLabel: {
    fontSize: 12,
    lineHeight: 22,
    pointerEvents: 'none',
    userSelect: 'none',
    color: TEXT_COLOR,
    marginBottom: 3,
  },
  hintText: {
    fontSize: SMALL_FONT_SIZE,
    fontFamily: DEFAULT_FONT_FAMILY,
    color: PLACEHOLDER_TEXT_COLOR,
  },
  errorText: {
    marginTop: 5,
  },
};
