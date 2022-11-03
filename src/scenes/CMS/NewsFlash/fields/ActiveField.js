// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {
  View,
  Text,
  ToggleSwitch,
} from '../../../../general/components/coreUIComponents';
import {DataLabel} from '../../../../general/components/UIComponents';

import {TEXT_COLOR} from '../../../../general/constants/colors';

import type {NewsFlash} from '../NewsFlash-type';

type Props = {
  values: NewsFlash;
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
};

export default function ActiveField(props: Props) {
  let {values, setFieldValue, setFieldTouched} = props;
  return (
    <View>
      <Text style={styles.floatingLabel}>STATUS</Text>
      <DataLabel>
        <ToggleSwitch
          label={values.status ? 'Active' : 'Not Active'}
          value={values.status}
          onToggle={() => {
            setFieldValue('active', !values.status);
            setFieldTouched('active', true);
          }}
          style={{alignSelf: 'center', marginHorizontal: 15}}
        />
      </DataLabel>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingLabel: {
    fontSize: 12,
    lineHeight: 22,
    pointerEvents: 'none',
    userSelect: 'none',
    color: TEXT_COLOR,
    marginBottom: 3,
  },
});
