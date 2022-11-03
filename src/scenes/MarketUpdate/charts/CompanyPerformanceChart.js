// @flow

import React from 'react';
import {View} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import StackedBarChart from '../../../general/components/charts/OverlappedBarRechart';

import {THEME_COLOR} from '../../../general/constants/colors';
import getGrowthColor from '../../../general/helpers/getGrowthColor';

type CompanyPerfomanceData = {
  territory: string;
  company: string;
  som: number;
  somGrowth: number;
  sortOrder: number;
};

type Props = {
  selectedTerritory: string;
  data: Array<CompanyPerfomanceData>;
};

export default function CompanyPerformanceChart(props: Props) {
  let {data, selectedTerritory} = props;

  if (!selectedTerritory) {
    return <PlaceholderView text="Please select Territory on global filter" />;
  } else if (selectedTerritory && data.length < 1) {
    return <PlaceholderView text="No data available" />;
  }

  let companySortedData = data.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <View style={{flex: 1, paddingRight: 20}}>
      <StackedBarChart
        key={companySortedData.length}
        data={companySortedData}
        xAxis="company"
        yAxis={['som', 'somGrowth']}
        showLabelValue
        showAxis
        showChartGrid
        showTooltip
        style={{
          somGrowth: {
            data: {
              fill: (d) => getGrowthColor(d['somGrowth']),
              width: 35,
            },
          },
          som: {
            data: {
              fill: THEME_COLOR,
              width: 50,
            },
          },
        }}
        extraProps={{
          barChart: {
            margin: {
              top: 20,
            },
          },
          tooltip: {
            dataKeyLabel: {
              som: 'SOM',
              somGrowth: 'SOM Growth',
            },
            dataKeyFill: {
              somGrowth: (d) => getGrowthColor(d['somGrowth']),
            },
          },
          som: {
            labelPlacement: 'outside',
          },
        }}
      />
    </View>
  );
}
