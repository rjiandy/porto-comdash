// @flow

import React from 'react';
import {View} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import BarChart from '../../../general/components/charts/BarRechart';

import convertObjectValueToNumber from '../../../general/helpers/convertObjectValueToNumber';
import sortDataWithPredefinedOrder from '../../../general/helpers/sortDataWithPredefinedOrder';
import {DEFAULT_FONT_SIZE} from '../../../general/constants/text';

import {
  ECC,
  CC,
  TARGET_CC,
  TARGET_ECC,
  TARGET_PS,
  PACKSOLD,
  THEME_COLOR,
} from '../../../general/constants/colors';

import type {KPIAchievement} from '../types/KPIAchievement-type';

type Props = {
  data: Map<string, KPIAchievement>;
  selectedBrand: string;
  selectedTerritory: string;
  isTerritoryIncludedInOptions: boolean;
};

const DEFAULT_SORTED_NAME = [
  'target cc',
  'cc',
  'target ecc',
  'ecc',
  'target ps',
  'packsold',
];

const BAR_COLOR = {
  'target cc': TARGET_CC,
  cc: CC,
  'target ecc': TARGET_ECC,
  ecc: ECC,
  'target ps': TARGET_PS,
  packsold: PACKSOLD,
};

export default function KPIAchievementChart(props: Props) {
  let {
    data,
    selectedTerritory,
    selectedBrand,
    isTerritoryIncludedInOptions,
  } = props;
  let filteredData = Array.from(data.values())
    .filter((datum) => {
      return DEFAULT_SORTED_NAME.includes(datum.kpi.toLowerCase());
    })
    .map((datum) => {
      return {
        ...convertObjectValueToNumber(datum, ['value']),
        fill: BAR_COLOR[datum.kpi.toLowerCase()] || THEME_COLOR,
      };
    });

  let sortedData = sortDataWithPredefinedOrder(
    DEFAULT_SORTED_NAME,
    filteredData,
    'kpi',
  );

  let content;
  if (!selectedTerritory) {
    content = <PlaceholderView text="Please select territory first" />;
  } else if (!isTerritoryIncludedInOptions) {
    content = <PlaceholderView text={`No data for ${selectedTerritory}`} />;
  } else if (!selectedBrand) {
    content = <PlaceholderView text="Please select brand first" />;
  } else {
    content = (
      <BarChart
        data={sortedData}
        xAxis="kpi"
        yAxis="value"
        style={{
          bar: {
            data: {width: 55},
          },
          axis: {
            tickLabels: {
              color: 'red',
            },
          },
        }}
        extraProps={{
          yAxis: {
            hide: false,
            axisLine: true,
            tickLine: true,
            tick: {fontSize: DEFAULT_FONT_SIZE},
          },
          barChart: {
            margin: {top: 0, right: 0, bottom: 0, left: 0},
          },
        }}
        showLabelValue
        showAxis
        showChartGrid
      />
    );
  }

  return <View style={{flex: 1, paddingTop: 10}}>{content}</View>;
}
