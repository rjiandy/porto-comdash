// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';

import convertObjectValueToNumber from '../../../general/helpers/convertObjectValueToNumber';
import commaSeparator from '../../../general/helpers/commaSeparator';
import sortDataWithPredefinedOrder from '../../../general/helpers/sortDataWithPredefinedOrder';

import {LIGHT_GREY, GREY} from '../../../general/constants/colors';
import {TITLE_FONT_SIZE} from '../../../general/constants/text';
import type {KPIAchievement} from '../types/KPIAchievement-type';

type Props = {
  data: Map<string, KPIAchievement>;
  selectedBrand: string;
  selectedTerritory: string;
  isTerritoryIncludedInOptions: boolean;
};

const DEFAULT_SORTED_SUMMARY = ['Program', 'Team', 'WorkingDays'];
const NAMING_MAP = {
  Program: 'Program',
  Team: 'Team',
  WorkingDays: 'Working Days',
};

export default function ProgramTeamDaysCountSummary(props: Props) {
  let {
    data,
    selectedBrand,
    selectedTerritory,
    isTerritoryIncludedInOptions,
  } = props;

  let placeholderText;
  if (!selectedTerritory) {
    placeholderText = 'Please select territory first';
  } else if (!isTerritoryIncludedInOptions) {
    placeholderText = `No data for ${selectedTerritory}`;
  } else if (!selectedBrand) {
    placeholderText = 'Please select brand first';
  }

  let filteredData: Array<KPIAchievement> = Array.from(data.values())
    .filter((datum) => {
      return DEFAULT_SORTED_SUMMARY.includes(datum.kpi);
    })
    .map((datum) => convertObjectValueToNumber(datum, ['value']));

  let sortedData = sortDataWithPredefinedOrder(
    DEFAULT_SORTED_SUMMARY,
    filteredData,
    'kpi',
  );

  let placeholder = [];

  for (let i = sortedData.length; i < 3; i++) {
    placeholder.push(
      <View
        key={`placedholder_dst_summary_${i}`}
        style={styles.summaryContainer}
      >
        <PlaceholderView text={placeholderText} />
      </View>,
    );
  }

  return (
    <View style={styles.root}>
      {sortedData.map((datum, index) => {
        return (
          <View key={index} style={styles.summaryContainer}>
            <Text fontWeight="bold" style={styles.value}>
              {commaSeparator(datum.value)}
            </Text>
            <Text fontWeight="light" style={styles.type}>
              {NAMING_MAP[datum.kpi]}
            </Text>
          </View>
        );
      })}
      {placeholder}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  value: {
    fontSize: TITLE_FONT_SIZE + 20,
  },
  type: {
    color: GREY,
  },
  summaryContainer: {
    flex: 1,
    marginBottom: 10,
    borderWidth: 0.1,
    borderColor: LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
