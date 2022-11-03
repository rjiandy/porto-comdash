// @flow

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {Text, StyleSheet} from 'react-primitives';

import OverlappedBarChart from '../../../general/components/charts/OverlappedBarRechart';
import {View} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import {
  CC,
  ECC,
  STRIKE_RATE,
  GREY,
  LIGHT_GREY,
} from '../../../general/constants/colors';
import convertObjectValueToNumber from '../../../general/helpers/convertObjectValueToNumber';

import type {ConsumerBrand} from '../types/ConsumerBrand-type';

type Props = {
  data: Array<ConsumerBrand>;
  selectedTerritory: string;
  selectedBrand: string;
  isTerritoryIncludedInOptions: boolean;
};

const CHART_HEIGHT = 800;

export default function ConsumerBrandChart(props: Props) {
  let {
    data,
    selectedBrand,
    selectedTerritory,
    isTerritoryIncludedInOptions,
  } = props;
  let convertedData = data.map((datum) =>
    convertObjectValueToNumber(datum, ['cc', 'ecc', 'strikeRate']),
  );
  let sortedData = convertedData.sort((a, b) => b.ecc - a.ecc).slice(0, 20);

  if (!selectedTerritory) {
    return (
      <View style={styles.root}>
        <PlaceholderView text="Please select territory first" />
      </View>
    );
  } else if (!isTerritoryIncludedInOptions) {
    return (
      <View style={styles.root}>
        <PlaceholderView text={`No data for ${selectedTerritory}`} />
      </View>
    );
  } else if (!selectedBrand) {
    return (
      <View style={styles.root}>
        <PlaceholderView text="Please select brand first" />
      </View>
    );
  } else {
    return (
      <View style={styles.root}>
        <OverlappedBarChart
          data={sortedData}
          xAxis="consumerBrand"
          yAxis={['cc', 'ecc']}
          showAxis
          showLabelValue
          showTooltip
          horizontal
          height={CHART_HEIGHT}
          style={{
            ecc: {
              data: {width: 15, fill: ECC},
            },
            cc: {
              data: {width: 30, fill: CC},
            },
          }}
          extraProps={{
            cc: {
              labelPlacement: 'outside',
              labelColor: CC,
            },
            xAxis: {
              domain: ['dataMin', 'dataMax + 50'],
            },
            barChart: {
              syncId: 'consumerBrand',
            },
            tooltip: {
              // NOTE: () => {} causes react display-name ESLint error
              content: function Tooltip(args) {
                return <ConsumerBrandTooltip {...args} displayData="ccEcc" />;
              },
            },
          }}
        />
        <ResponsiveContainer width="40%" height={CHART_HEIGHT}>
          <LineChart
            syncId="consumerBrand"
            layout="vertical"
            data={sortedData}
            margin={{top: 15, right: 30, bottom: 20}}
          >
            <XAxis
              hide
              type="number"
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={['dataMin - 40', 'dataMax + 40']}
              minTickGap={20}
            />
            <YAxis
              hide
              dataKey="consumerBrand"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            {sortedData.length && (
              <Tooltip
                content={(args) => (
                  <ConsumerBrandTooltip {...args} displayData="strikeRate" />
                )}
              />
            )}
            <Line dataKey="strikeRate" stroke={STRIKE_RATE} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </View>
    );
  }
}

type Payload = {
  dataKey: string;
  color: string;
  payload: ConsumerBrand;
};

type TooltipProps = {
  active: boolean;
  payload: Array<Payload>;
  displayData: 'ccEcc' | 'strikeRate';
};

function ConsumerBrandTooltip(props: TooltipProps) {
  let {active, payload, displayData} = props;
  let [data] = payload;
  if (active) {
    return (
      <View style={styles.tooltipContainer}>
        {displayData === 'ccEcc' ? (
          <View>
            <Text style={{color: ECC}}>ECC: {data.payload.ecc}</Text>
            <Text style={{color: CC}}>CC: {data.payload.cc}</Text>
          </View>
        ) : (
          <Text style={{color: STRIKE_RATE}}>
            Strike Rate: {data.payload.strikeRate}
          </Text>
        )}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'scroll',
  },
  tooltipContainer: {
    padding: 10,
    maxWidth: 150,
    backgroundColor: 'white',
    borderColor: GREY,
    borderWidth: 0.5,
  },
  noData: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginLeft: 10,
  },
});
