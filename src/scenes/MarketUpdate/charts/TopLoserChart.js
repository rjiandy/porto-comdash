// @flow

import React from 'react';

import BarChart from '../../../general/components/charts/BarRechart';

import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';

type SomData = {
  brand: string;
  som: number;
};

type Props = {
  data: Array<SomData>;
  selectedTerritory: string;
};

export default function TopLoserChart(props: Props) {
  let {data, selectedTerritory} = props;
  let content;
  if (!selectedTerritory) {
    content = (
      <PlaceholderView text="Please select Territory on global filter" />
    );
  } else if (selectedTerritory && !data.length) {
    content = <PlaceholderView text="No data available" />;
  } else {
    content = (
      <BarChart
        data={data}
        style={style}
        xAxis="brand"
        yAxis="som"
        tickLabelPosition="right"
        extraProps={{
          barChart: {
            margin: {
              left: 30,
            },
          },
          bar: {
            tickPlacement: 'outside',
          },
          xAxis: {
            domain: ['auto', 0],
          },
          tooltip: {
            dataKeyLabel: {
              som: 'SOM',
            },
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
        YTD Top Loser
      </Text>
      {content}
    </View>
  );
}

const style = {
  bar: {
    data: {
      width: 20,
      fill: '#E25F4A',
    },
    labels: {
      fontSize: 10,
    },
  },
};
