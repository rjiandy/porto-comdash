// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import StackedBarChart from '../../../general/components/charts/OverlappedBarRechart';
import {
  SHADOW_GREY,
  PALE_RED,
  LIGHT_GREY,
} from '../../../general/constants/colors';
import {DEFAULT_FONT_SIZE} from '../../../general/constants/text';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';

import type {DistributionPerformanceSom} from '../types/DistributionPerformanceSom-type';

type Props = {
  data: Map<string, DistributionPerformanceSom>;
  maxSelectedProduct: number;
};

export default function SomPriceTrendChart(props: Props) {
  let {data, maxSelectedProduct} = props;
  let charts = [];

  for (let [key, value] of data) {
    let dataProduct = value;
    charts.push(
      <View key={key} style={styles.item}>
        <StackedBarChart
          data={dataProduct}
          yAxis={['wdl', 'woos']}
          xAxis="monthID"
          overlap
          style={{
            wdl: {
              data: {width: 30, fill: SHADOW_GREY},
              labels: {fontSize: DEFAULT_FONT_SIZE},
            },
            woos: {
              data: {width: 15, fill: PALE_RED},
              labels: {fontSize: DEFAULT_FONT_SIZE, fill: 'white'},
            },
          }}
          height={200}
          extraProps={{
            xAxis: {
              tickFormatter: (label) => getMonthDescByID(String(label)),
            },
            tooltip: {
              labelFormatter: (label) => getMonthDescByID(String(label)),
              dataKeyLabel: {
                wdl: 'DL',
                woos: 'OOS',
              },
            },
          }}
          showAxis
          showLabelValue
          showTooltip
          showChartGrid
        />
      </View>,
    );
  }

  if (charts.length < maxSelectedProduct) {
    for (let i = charts.length; i < maxSelectedProduct; i++) {
      charts.push(
        <View key={i} style={styles.item}>
          <PlaceholderView text="Please select another product to compare" />
        </View>,
      );
    }
  }
  return <View style={styles.root}>{charts}</View>;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderTopWidth: 0.4,
    borderBottomWidth: 0.4,
    borderColor: LIGHT_GREY,
  },
  item: {
    flex: 1,
    borderLeftWidth: 0.3,
    borderRightWidth: 0.3,
    borderColor: LIGHT_GREY,
    paddingHorizontal: 10,
  },
});
