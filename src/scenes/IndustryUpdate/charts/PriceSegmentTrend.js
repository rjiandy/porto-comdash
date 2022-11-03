// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import {Rectangle} from '../../../general/components/shapesComponent';
import {
  TITLE_FONT_SIZE,
  SMALL_FONT_SIZE,
  TINY_FONT_SIZE,
} from '../../../general/constants/text';
import {LINE_CHART_COLORS} from '../../../general/constants/colors';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';

import LineChart from '../../../general/components/charts/LineRechart';

import type {PriceSegment} from '../types/PriceSegment-type';

type Props = {
  data: Array<Array<PriceSegment>>;
  showPlaceholder: boolean;
};

export default function PriceSegmentTrend(props: Props) {
  let {data, showPlaceholder} = props;
  let dataWithFill = data
    .sort((a, b) => a[0].sortOrder - b[0].sortOrder)
    .map((datum, index) =>
      datum.map((datumObj) => ({...datumObj, fill: LINE_CHART_COLORS[index]})),
    );
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Price Segment Trend</Text>
      {showPlaceholder ? (
        <PlaceholderView text="Please select Territory on global filter" />
      ) : (
        <View style={styles.flex}>
          <LineChart
            data={dataWithFill}
            xAxis="timeMonthID"
            yAxis="som"
            tooltipInfo="priceSegment"
            style={{
              tooltip: {fontSize: SMALL_FONT_SIZE},
              axis: {
                tickLabels: {fontSize: TINY_FONT_SIZE},
              },
              label: {fontSize: TINY_FONT_SIZE},
            }}
            extraProps={{
              xAxis: {
                tickFormatter: (tick) => getMonthDescByID(String(tick)),
              },
              tooltip: {
                labelFormatter: (label) => getMonthDescByID(String(label)),
              },
              lineChart: {
                margin: {top: 5, right: 5, bottom: 0, left: 5},
              },
            }}
            showLabelValue
            showTooltip
            showChartGrid
            showAxis
          />
          <View style={[styles.legendContainer, styles.rowFlexed]}>
            {dataWithFill.map(
              (datum, index) =>
                datum[0] && (
                  <View
                    style={[styles.rowFlexed, styles.centerAligned]}
                    key={index}
                  >
                    <Rectangle backgroundColor={datum[0].fill} size={1.5} />
                    <Text style={styles.leftPadding}>
                      {datum[0].priceSegment}
                    </Text>
                  </View>
                ),
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    paddingLeft: 30,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    textAlign: 'center',
  },
  legendContainer: {
    paddingBottom: 10,
    marginTop: -5,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  centerAligned: {
    alignItems: 'center',
  },
  leftPadding: {
    paddingLeft: 5,
  },
});
