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
  // CartesianGrid,
} from 'recharts';
import {StyleSheet} from 'react-primitives';

import {View, Text} from '../coreUIComponents';
import {WHITE, GREY} from '../../constants/colors';
import {SMALL_FONT_SIZE} from '../../constants/text';
import {
  DEFAULT_BAR_SIZE,
  ANIMATION_DURATION,
} from '../../constants/chartSettings';

import type {ChartDatum} from '../../types/Chart-types';

type Props = {
  data: Array<ChartDatum>;
  xAxis: string;
  yAxis: string;
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

export default function BarRechart(props: Props) {
  let {
    data,
    xAxis,
    yAxis,
    showAxis,
    showLabelValue,
    showTooltip,
    showLegend,
    horizontal,
    tickLabelPosition,
    width,
    height,
    style,
    // showChartGrid,
  } = props;
  let extraProps = props.extraProps || {};
  let customStyle = style || {};
  return (
    <ResponsiveContainer
      width={width || '100%'}
      height={height || '100%'}
      {...extraProps.container}
    >
      <BarChart
        data={data}
        // NOTE: Layout is about the group names' position, NOT the bar's direction. Example:
        //                     |_ _ _
        //                   a |_ _ _|
        //                     |_ _
        //                   b |_ _|
        //                     |_ _ _ _
        //                   c |_ _ _ _|
        //                     | _ _ _ _ _
        //                       1 2 3 4 5
        //       [a, b, c] are the group names, while [1, 2, 3, 4, 5] are the values.
        //       The example is layout vertical because the group names are positioned vertically.
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
            {...extraProps.yAxis}
          />
        )}
        {data.length > 0 &&
          showTooltip && (
            <Tooltip
              content={(args) => <CustomTooltip {...args} />}
              {...extraProps.tooltip}
            />
          )}
        {showLegend && <Legend {...extraProps.legend} />}
        {/* {showChartGrid && <CartesianGrid strokeDasharray="3 3" />} */}
        <Bar
          animationDuration={ANIMATION_DURATION}
          dataKey={yAxis}
          fill={style && style.bar && style.bar.data.fill}
          barSize={
            (style && style.bar && style.bar.data.width) || DEFAULT_BAR_SIZE
          }
          maxBarSize={
            (style && style.bar && style.bar.data.width) || DEFAULT_BAR_SIZE
          }
          label={(args) =>
            showLabelValue && (
              <CustomizedBarTick
                {...extraProps.bar}
                {...args}
                horizontal={horizontal}
                style={(customStyle.bar && customStyle.bar.label) || {}}
                tickLabelPosition={tickLabelPosition || 'left'}
              />
            )}
          {...extraProps.bar}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

type TickLabelProps = {
  x: number;
  y: number;
  value: string;
  key: string;
  width: number;
  height: number;
  offset: number;
  horizontal: boolean;
  tickPlacement: 'inside' | 'outside';
  tickLabelPosition: 'left' | 'right';
  labelFormatter?: (label: string) => string;
  style?: StyleSheetTypes;
};

function CustomizedBarTick(props: TickLabelProps) {
  const {
    x,
    y,
    value,
    width,
    height,
    offset,
    horizontal,
    labelFormatter,
    style,
    tickPlacement,
    tickLabelPosition,
  } = props;
  let label = value;
  let defaultTickPlacement = tickPlacement || 'inside';
  let dy = -10;
  let dx = width / 2;
  if (defaultTickPlacement === 'inside') {
    if (!horizontal && Math.abs(height) < 17) {
      return null;
    }
    if (horizontal && Math.abs(width) < 20) {
      return null;
    }
    dy = (height + offset * 1.5) / 2;
    // dx = width / 2;
  } else if (defaultTickPlacement === 'outside') {
    if (horizontal) {
      dy = (height + offset * 1.5) / 2;
      dx = width + offset * 1.7 + 5;
      if (tickLabelPosition === 'right') {
        dx -= 30;
      }
    }
  }

  let customStyle = style || {};

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dx={dx}
        dy={dy}
        textAnchor="middle"
        fill={defaultTickPlacement === 'outside' ? 'black' : WHITE}
        style={{fontSize: SMALL_FONT_SIZE, zIndex: 10, ...customStyle}}
      >
        {label && labelFormatter ? labelFormatter(label) : label}
      </text>
    </g>
  );
}

type TooltipProps = {
  payload: Array<{[key: string]: any}>;
  label: string;
  dataKeyLabel?: {[key: string]: string};
  valueFormatter?: (value: number) => number;
};

function CustomTooltip(props: TooltipProps) {
  let {payload, label, dataKeyLabel, valueFormatter} = props;
  if (payload == null) {
    return null;
  }
  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipTitle}>{label}</Text>
      {payload.map((data, index) => {
        let color = data.fill;
        if (typeof data.fill === 'function') {
          color = data.fill(data.payload);
        }
        return (
          <Text key={index} style={{color}}>
            {dataKeyLabel != null ? dataKeyLabel[data.dataKey] : data.dataKey}:{' '}
            {valueFormatter ? valueFormatter(data.value) : data.value}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: WHITE,
    borderColor: GREY,
    borderWidth: 1,
    padding: 10,
  },
  tooltipTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
