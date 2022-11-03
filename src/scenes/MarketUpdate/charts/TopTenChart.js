// @flow

import React from 'react';

import OverlappedBarRechart from '../../../general/components/charts/OverlappedBarRechart';
import getGrowthColor from '../../../general/helpers/getGrowthColor';

import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import {THEME_COLOR} from '../../../general/constants/colors';
import roundDecimal from '../../../general/helpers/roundDecimal';

type TopTenData = {
  order: number;
  brand: string;
  som: number;
  somGrowth: number;
};

type Props = {
  data: Array<TopTenData>;
  selectedTerritory: string;
};

export default function TopTenChart(props: Props) {
  let {data, selectedTerritory} = props;
  let content;
  let roundedData = props.data.reverse().map((data) => {
    return {
      ...data,
      somGrowth: roundDecimal(data.somGrowth),
    };
  });
  if (!selectedTerritory) {
    content = (
      <PlaceholderView text="Please select Territory on global filter" />
    );
  } else if (selectedTerritory && !data.length) {
    content = <PlaceholderView text="No data available" />;
  } else {
    content = (
      <OverlappedBarRechart
        data={roundedData}
        style={style}
        xAxis="brand"
        yAxis={['som', 'somGrowth']}
        extraProps={{
          barChart: {
            margin: {
              right: 30,
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
          xAxis: {
            domain: ['dataMin', 'dataMax'],
          },
          som: {
            labelPlacement: 'outside',
            labelFormatter: (label) => roundDecimal(String(label)),
          },
          somGrowth: {
            labelFormatter: () => '',
          },
        }}
        showAxis
        showLabelValue
        horizontal
        showTooltip
        showChartGrid
      />
    );
  }
  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 20, textAlign: 'center', paddingBottom: 10}}>
        YTD Top 10 Brands
      </Text>
      {content}
    </View>
  );
}

const style = {
  som: {
    data: {
      width: 20,
      fill: THEME_COLOR,
    },
  },
  somGrowth: {
    data: {
      width: 12.5,
      fill: (d) => getGrowthColor(d['somGrowth']),
    },
  },
};
