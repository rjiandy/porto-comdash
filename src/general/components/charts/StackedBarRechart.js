// @flow

import React from 'react';

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
  CartesianGrid,
} from 'recharts';
import {StyleSheet} from 'react-primitives';

import {View, Text} from '../coreUIComponents';
import {WHITE, MEDIUM_GREY} from '../../constants/colors';
import {SMALL_FONT_SIZE} from '../../constants/text';
import {
  DEFAULT_BAR_SIZE,
  ANIMATION_DURATION,
} from '../../constants/chartSettings';

import type {ChartDatum} from '../../types/Chart-types';

type Props = {
  data: Array<ChartDatum> | Array<Array<ChartDatum>>;
  xAxis: string;
  yAxis: string;
  tooltipInfo: string;
  showAxis?: boolean;
  showLabelValue?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showChartGrid?: boolean;
  horizontal?: boolean;
  tickLabelPosition?: 'left' | 'right';
  width?: number;
  height?: number;
  style?: {
    bar?: {[key: string]: *};
    container?: {[key: string]: *};
    axis?: {[key: string]: *};
  };
  extraProps?: {
    container?: {[key: string]: *};
    xAxis?: {[key: string]: *};
    yAxis?: {[key: string]: *};
    barChart?: {[key: string]: *};
    bar?: {[key: string]: *};
    legend?: {[key: string]: *};
    tooltip?: {[key: string]: *};
  };
};

export function prepareStackedBarChartData(
  rawData: Array<ChartDatum> | Array<Array<ChartDatum>>,
  xAxis: string,
  yAxis: string,
  tooltipInfo: string,
): {
  tooltipData: Array<string>;
  stackedBarChartData: Array<ChartDatum>;
} {
  let stackedBarChartData = new Map();
  let tooltipData = [];
  for (let data of rawData) {
    if (Array.isArray(data)) {
      for (let datum of data) {
        tooltipData.push(`d_${datum[tooltipInfo]}`);
        // NOTE: we need to exclude fill from being spread over to the final data
        //       because it will override individual bar color and mess things up
        let {fill, ...otherData} = datum;
        let prevData = {};
        if (stackedBarChartData.has(datum[xAxis])) {
          prevData = stackedBarChartData.get(datum[xAxis]);
        }
        stackedBarChartData.set(datum[xAxis], {
          ...prevData,
          ...otherData,
          [`d_${datum[tooltipInfo]}`]: datum[yAxis],
          [`d_${datum[tooltipInfo]}_fill`]: fill,
        });
      }
    } else {
      let prevData = {};
      if (stackedBarChartData.has(data[xAxis])) {
        prevData = stackedBarChartData.get(data[xAxis]);
      }
      tooltipData.push(`d_${data[tooltipInfo]}`);
      let {fill, ...otherData} = data;
      stackedBarChartData.set(data[xAxis], {
        ...prevData,
        ...otherData,
        [`d_${data[tooltipInfo]}`]: data[yAxis],
        [`d_${data[tooltipInfo]}_fill`]: fill,
      });
    }
  }
  return {
    tooltipData: [...new Set(tooltipData)],
    stackedBarChartData: [...stackedBarChartData.values()],
  };
}

export default function StackedBarRechart(props: Props) {
  let {
    data,
    xAxis,
    yAxis,
    tooltipInfo,
    showAxis,
    showLabelValue,
    showTooltip,
    showLegend,
    showChartGrid,
    horizontal,
    tickLabelPosition,
    width,
    height,
    style,
  } = props;
  let extraProps = props.extraProps || {};
  let {tooltipData, stackedBarChartData} = prepareStackedBarChartData(
    data,
    xAxis,
    yAxis,
    tooltipInfo,
  );
  let bars = [];
  for (let dataKey of tooltipData) {
    let color = stackedBarChartData[0][`${dataKey}_fill`];
    bars.push(
      <Bar
        animationDuration={ANIMATION_DURATION}
        key={bars.length}
        stackId="stack"
        dataKey={dataKey}
        fill={color}
        barSize={
          (style && style.bar && style.bar.data.width) || DEFAULT_BAR_SIZE
        }
        maxBarSize={
          (style && style.bar && style.bar.data.width) || DEFAULT_BAR_SIZE
        }
        label={(args) =>
          showLabelValue && (
            <CustomBarLabel
              {...args}
              horizontal={horizontal}
              data={stackedBarChartData}
              dataKey={dataKey}
            />
          )}
        {...extraProps[dataKey]}
      >
        <Cell fill={color} />
      </Bar>,
    );
  }
  return (
    <ResponsiveContainer
      width={width || '100%'}
      height={height || '100%'}
      {...extraProps.container}
    >
      <BarChart
        data={stackedBarChartData}
        layout={horizontal ? 'vertical' : 'horizontal'}
        {...extraProps.barChart}
      >
        {!horizontal ? (
          <XAxis
            type="category"
            dataKey={xAxis}
            tick={{fontSize: SMALL_FONT_SIZE, width: 150}}
            tickLine={false}
            axisLine={showAxis || false}
            interval={0}
            {...extraProps.xAxis}
          />
        ) : (
          <XAxis
            hide
            type="number"
            tick={false}
            tickLine={false}
            axisLine={false}
            {...extraProps.xAxis}
          />
        )}
        {horizontal ? (
          <YAxis
            type="category"
            width={120}
            dataKey={xAxis}
            orientation={tickLabelPosition || 'left'}
            tick={{fontSize: SMALL_FONT_SIZE, width: 150}}
            tickLine={false}
            axisLine={showAxis || false}
            interval={0}
            {...extraProps.yAxis}
          />
        ) : (
          <YAxis
            hide
            type="number"
            tick={false}
            tickLine={false}
            axisLine={false}
            domain={['dataMin', 'dataMax + 10']}
            {...extraProps.yAxis}
          />
        )}
        {stackedBarChartData.length > 0 &&
          showTooltip && (
            <Tooltip
              content={(args) => <CustomTooltip {...args} />}
              {...extraProps.tooltip}
            />
          )}
        {showLegend && <Legend {...extraProps.legend} />}
        {showChartGrid && <CartesianGrid strokeDasharray="3 3" />}
        {bars}
      </BarChart>
    </ResponsiveContainer>
  );
}

type TooltipProps = {
  payload: Array<{[key: string]: any}>;
  label: string;
  filterFn: <T>(Array<T>) => Array<T>;
};

function CustomTooltip(props: TooltipProps) {
  let {payload, label, filterFn} = props;
  let processedData = payload;
  if (filterFn) {
    processedData = filterFn(payload);
  }
  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipTitle}>{label}</Text>
      {processedData.map((data, index) => (
        <Text key={index} style={{color: data.fill}}>
          {data.dataKey.split('d_')[1]}: {data.value}
        </Text>
      ))}
    </View>
  );
}

type TickLabelProps = {
  x: number;
  y: number;
  index: number;
  width: number;
  height: number;
  offset: number;
  horizontal: boolean;
  data: Array<ChartDatum>;
  tooltips: Array<string>;
  dataKey: string;
};

function CustomBarLabel(props: TickLabelProps) {
  const {x, y, index, width, height, offset, horizontal, data, dataKey} = props;
  let label = data[index][dataKey];
  if (!horizontal && Math.abs(height) < 17) {
    return null;
  }
  if (horizontal && Math.abs(width) < 20) {
    return null;
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dx={width / 2}
        dy={(height + offset * 1.5) / 2}
        textAnchor="middle"
        fill={WHITE}
        style={{fontSize: SMALL_FONT_SIZE, zIndex: 10}}
      >
        {Number(label).toFixed(1)}
      </text>
    </g>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: WHITE,
    borderColor: MEDIUM_GREY,
    borderWidth: 1,
    padding: 10,
  },
  tooltipTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
