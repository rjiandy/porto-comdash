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

type UserGroup = any;

type Props = {
  values: UserGroup;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  handleBlur: () => void;
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
};

export default function TitleField(props: Props) {
  let {values, handleBlur, errors, touched, setFieldValue} = props;

  let onChangeHandler = (newValue: string) => {
    setFieldValue('title', newValue);
  };
  return (
    <View>
      <Text
        style={[
          styles.floatingLabel,
          errors.title && touched.title ? {color: 'red'} : null,
        ]}
      >
        TITLE*
      </Text>
      <TextInput
        id="title"
        fullWidth
        value={values.title}
        onTextChange={onChangeHandler}
        onBlur={handleBlur}
        errorText={errors.title && touched.title ? errors.title : ''}
        errorStyle={styles.errorText}
        hintText="User Group Name"
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
