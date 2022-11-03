// @flow
import React from 'react';
import {View, Text} from '../../../general/components/coreUIComponents';
import formatChartInput from '../../../general/helpers/formatChartInput';
import GaugeChart from '../../../general/components/charts/GaugeChart';
import BarChart from '../../../general/components/charts/BarRechart';
import commaSeparator from '../../../general/helpers/commaSeparator';

import {THEME_COLOR, GROWTH_COLOR} from '../../../general/constants/colors';
import {TITLE_FONT_SIZE} from '../../../general/constants/text';
// import getWeekNumber from '../helpers/getWeekNumber';

import type {SalesGrowth} from '../LandingPage-types';

type Location = 'upper' | 'side';

type Props = {
  dataSource: SalesGrowth;
  location: Location;
  territory: string;
};

function SalesGrowthChart(props: Props) {
  let {dataSource, location, territory} = props;
  // let {timeWeekId} = dataSource;
  let ytdKeys = [
    {from: 'salesLyytd', to: 'YTD LY (Mio)'},
    {from: 'salesYtd', to: 'YTD TY (Mio)'},
  ];

  // TODO: confirm with them ${(timeWeekId && getWeekNumber(timeWeekId.toString()) - 1)

  let kpsKeys = [
    {
      from: 'salesPreviousWeek',
      to: `KPS-1 ('000)`,
    },
    {
      from: 'salesCurrentWeek',
      to: `KPS-0 ('000)`,
    },
  ];
  let gaugeValue = Number(dataSource.objectivePCT);
  let ytdGrowthValue = Number(dataSource.growthLy);
  let ytdData = formatChartInput(dataSource, ytdKeys);
  let kpsData = formatChartInput(dataSource, kpsKeys);

  return (
    <View
      style={[
        {flex: 1},
        location === 'upper'
          ? {flexDirection: 'row', paddingBottom: 5}
          : {justifyContent: 'space-around'},
      ]}
    >
      <VolumeOBChart
        data={gaugeValue}
        location={location}
        territory={territory}
      />
      <YTDChart data={ytdData} ytdGrowthValue={ytdGrowthValue} />
      <KPSChart data={kpsData} />
    </View>
  );
}

type VolumeOBProps = {
  data: ?number;
  location: 'upper' | 'side';
  territory: string;
};

function VolumeOBChart(props: VolumeOBProps) {
  let {data, location, territory} = props;
  if (territory !== 'Indonesia') {
    return null;
  }
  return (
    <View
      style={{
        flex: location === 'upper' ? 1 : 1.1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: location === 'upper' ? 0 : 15,
      }}
    >
      <View style={{flex: 1}}>
        <GaugeChart
          value={data || 0}
          width={200}
          toolTipLabel="Volume Achievement vs OB"
          offset={85}
          colorData={[
            {value: 5, color: 'red'},
            {value: 5, color: 'red'},
            {value: 5, color: 'red'},
            {value: 5, color: 'gold'},
            {value: 5, color: 'green'},
            {value: 5, color: 'green'},
          ]}
        />
      </View>
      <Text
        style={{
          textAlign: 'center',
          paddingBottom: location === 'upper' ? 0 : 10,
          fontSize: TITLE_FONT_SIZE,
        }}
      >
        Volume Achievement vs OB
      </Text>
    </View>
  );
}

type BarChartProps = {
  name: string;
  value: number;
};

type YTDChartProps = {
  data: Array<BarChartProps>;
  ytdGrowthValue: number;
};

function YTDChart(props: YTDChartProps) {
  let {data, ytdGrowthValue} = props;
  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          paddingLeft: 30,
          alignSelf: 'center',
          color:
            ytdGrowthValue > 0
              ? GROWTH_COLOR.high
              : ytdGrowthValue < 0 ? GROWTH_COLOR.low : 'black',
        }}
      >
        {ytdGrowthValue}%
      </Text>
      <BarChart
        data={data}
        xAxis="name"
        yAxis="value"
        extraProps={{
          barChart: {
            margin: {
              left: 30,
              top: 15,
              bottom: 20,
            },
          },
          bar: {
            tickPlacement: 'outside',
            labelFormatter: commaSeparator,
          },
          xAxis: {
            tick: {fontSize: TITLE_FONT_SIZE, width: 80},
          },
        }}
        style={{
          bar: {
            data: {fill: THEME_COLOR, width: 70},
          },
        }}
        showChartGrid
        showLabelValue
        showTooltip
      />
    </View>
  );
}

type KPSChartProps = {
  data: Array<BarChartProps>;
};

function KPSChart(props: KPSChartProps) {
  let {data} = props;
  return (
    <View style={{flex: 1}}>
      <BarChart
        data={data}
        xAxis="name"
        yAxis="value"
        extraProps={{
          barChart: {
            margin: {
              left: 30,
              top: 20,
              bottom: 15,
            },
          },
          bar: {
            tickPlacement: 'outside',
            labelFormatter: commaSeparator,
          },
          xAxis: {
            tick: {fontSize: TITLE_FONT_SIZE, width: 80},
          },
        }}
        style={{
          bar: {
            data: {fill: THEME_COLOR, width: 70},
          },
        }}
        showChartGrid
        showLabelValue
        showTooltip
      />
    </View>
  );
}

export default SalesGrowthChart;
