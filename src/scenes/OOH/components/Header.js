// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import commaSeparator from '../../../general/helpers/commaSeparator';
import {THEME_COLOR, GREY} from '../../../general/constants/colors';
import {HEADER_FONT_SIZE} from '../../../general/constants/text';

import type {OOH} from '../type/OOH-type';

type Props = {
  data: ?OOH;
  selectedTerritory: string;
};

export default function Header(props: Props) {
  let {data, selectedTerritory} = props;
  if (!selectedTerritory) {
    return (
      <View style={{height: 80}}>
        <PlaceholderView text="Please select territory first" />
      </View>
    );
  } else if (!data) {
    return (
      <View style={{height: 80}}>
        <PlaceholderView
          text={`No data available for territory ${selectedTerritory}`}
        />
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerItem}>
        <Text
          style={[styles.headerData, styles.headerDataNumber]}
          customStyle="header"
        >
          {commaSeparator(data.billboard || 0)}
        </Text>
        <Text style={styles.headerData} customStyle="title">
          Billboard
        </Text>
      </View>
      <View style={styles.headerItem}>
        <Text
          style={[styles.headerData, styles.headerDataNumber]}
          customStyle="header"
        >
          {commaSeparator(data.baliho || 0)}
        </Text>
        <Text style={styles.headerData} customStyle="title">
          Baliho
        </Text>
      </View>
      <View style={styles.headerItem}>
        <Text
          style={[styles.headerData, styles.headerDataNumber]}
          customStyle="header"
        >
          {commaSeparator(data.minibillboard || 0)}
        </Text>
        <Text style={styles.headerData} customStyle="title">
          Mini Billboard
        </Text>
      </View>
      <View style={styles.headerItem}>
        <Text
          style={[styles.headerData, styles.headerDataNumber]}
          customStyle="header"
        >
          {commaSeparator(data.streetsignage || 0)}
        </Text>
        <Text style={styles.headerData} customStyle="title">
          Street Sign
        </Text>
      </View>
      <View style={styles.headerItem}>
        <Text
          style={[styles.headerData, styles.headerDataNumber]}
          customStyle="header"
        >
          {commaSeparator(data.others || 0)}
        </Text>
        <Text style={styles.headerData} customStyle="title">
          Other OOH
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    borderWidth: 5,
    borderColor: THEME_COLOR,
    borderStyle: 'solid',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  headerData: {
    color: GREY,
    fontWeight: 'bold',
  },
  headerDataNumber: {
    fontSize: HEADER_FONT_SIZE + 10,
  },
});
