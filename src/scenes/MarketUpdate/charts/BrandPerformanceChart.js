// @flow

import React from 'react';

import {StyleSheet} from 'react-primitives';

import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import {Rectangle} from '../../../general/components/shapesComponent';

import LineChart from '../../../general/components/charts/LineRechart';

import {TINY_FONT_SIZE} from '../../../general/constants/text';
import {LINE_CHART_COLORS} from '../../../general/constants/colors';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';

import type {BrandPerformance} from '../types/BrandPerformance-type';

type Props = {
  data: Array<Array<BrandPerformance>>;
  selectedBrand: string;
};

export default function BrandPerformanceChart(props: Props) {
  let {data, selectedBrand} = props;
  let sortedData = [...data].sort((a, b) => a[0].sortOrderProduct - b[0].sortOrderProduct);
  if (!selectedBrand) {
    return (
      <PlaceholderView text="Please select Brand Family on global filter" />
    );
  } else if (selectedBrand && sortedData.length === 0) {
    return <PlaceholderView text="No data available" />;
  }

  return (
    <View style={styles.rootContainer}>
      <LineChart
        key={sortedData.length}
        data={sortedData}
        xAxis="monthId"
        yAxis="som"
        tooltipInfo="product"
        dxLabel={15}
        style={{
          axis: {
            tickLabels: {
              fontSize: TINY_FONT_SIZE - 3,
            },
          },
        }}
        extraProps={{
          xAxis: {
            tickFormatter: (label) => getMonthDescByID(String(label)),
          },
          tooltip: {
            labelFormatter: (label) => getMonthDescByID(String(label)),
          },
        }}
        showAxis
        showLabelValue
        showTooltip
        showChartGrid
      />
      <View
        style={[
          styles.rowFlexed,
          styles.wrap,
          styles.spaceBetween,
          {marginTop: -10},
        ]}
      >
        {sortedData.map((datum, index) => {
          if (datum[0]) {
            return (
              <View style={[styles.rowFlexed, styles.centerAligned]}>
                <Rectangle
                  backgroundColor={LINE_CHART_COLORS[index]}
                  size={1}
                />
                <Text style={styles.leftMargin}>{datum[0].product}</Text>
              </View>
            );
          } else {
            // eslint-disable-next-line
            return;
          }
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingRight: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {},
  rowFlexed: {
    flexDirection: 'row',
  },
  centerAligned: {
    alignItems: 'center',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  leftMargin: {
    marginLeft: 5,
  },
  bottomMargin: {
    marginBottom: 5,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});
