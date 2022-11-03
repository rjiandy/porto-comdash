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
  ReferenceLine,
  Cell,
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
  yAxis: Array<string>;
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

export default function OverlappedBarRechart(props: Props) {
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
  let xAxes = [];
  let yAxes = [];
  let bars = [];
  for (let yValue of yAxis) {
    if (!horizontal) {
      xAxes.push(
        <XAxis
          key={`x${xAxes.length}`}
          xAxisId={bars.length}
          type="category"
          dataKey={xAxis}
          tick={xAxes.length === 0 && {fontSize: SMALL_FONT_SIZE, width: 150}}
          tickLine={false}
          axisLine={(xAxes.length === 0 && showAxis) || false}
          hide={xAxes.length > 0}
          interval={0}
          {...extraProps.xAxis}
        />,
      );
    } else {
      yAxes.push(
        <YAxis
          key={`y${yAxes.length}`}
          yAxisId={bars.length}
          type="category"
          width={120}
          dataKey={xAxis}
          orientation={tickLabelPosition || 'left'}
          tick={yAxes.length === 0 && {fontSize: SMALL_FONT_SIZE, width: 150}}
          tickLine={false}
          axisLine={(yAxes.length === 0 && showAxis) || false}
          hide={yAxes.length > 0}
          interval={0}
          {...extraProps.yAxis}
        />,
      );
    }
    let barFill;
    if (style && style[yValue] && typeof style[yValue].data.fill === 'string') {
      barFill = style[yValue].data.fill;
    }
    bars.push(
      <Bar
        key={`bar${bars.length}`}
        animationDuration={ANIMATION_DURATION}
        xAxisId={(!horizontal && bars.length) || 0}
        yAxisId={(horizontal && bars.length) || 0}
        dataKey={yValue}
        fill={barFill}
        barSize={
          (style && style[yValue] && style[yValue].data.width) ||
          DEFAULT_BAR_SIZE
        }
        maxBarSize={
          (style && style[yValue] && style[yValue].data.width) ||
          DEFAULT_BAR_SIZE
        }
        label={(args) =>
          showLabelValue && (
            <CustomizedBarTick
              {...extraProps[yValue]}
              {...args}
              horizontal={horizontal}
            />
          )}
        horizontal={!horizontal}
        {...extraProps[yValue]}
      >
        {style &&
          style[yValue] &&
          typeof style[yValue].data.fill === 'function' &&
          data.map((datum, index) => {
            let color;
            if (style && style[yValue]) {
              color = style[yValue].data.fill(datum);
            }
            return <Cell key={index} fill={color} />;
          })}
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
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        {...extraProps.barChart}
      >
        {xAxes.length > 0 ? (
          <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
        ) : (
          <ReferenceLine x={0} stroke="#000" strokeDasharray="3 3" />
        )}
        {xAxes.length > 0 ? (
          xAxes
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
        {yAxes.length > 0 ? (
          yAxes
        ) : (
          <YAxis
            hide
            type="number"
            tick={false}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
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
        {bars}
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
  labelPlacement?: 'center' | 'outside';
  labelColor?: string;
  dxCoefficient: ?number;
  labelFormatter?: (label: string) => string;
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
    labelPlacement,
    labelColor,
    dxCoefficient,
    labelFormatter,
  } = props;
  let label = value;

  let dy = -10;
  let dx = width / 2;
  if (dxCoefficient) {
    dx = width * dxCoefficient;
  }
  let defaultLabelPlacement = labelPlacement || 'inside';
  let text = label && labelFormatter ? labelFormatter(label) : label;
  if (defaultLabelPlacement === 'inside') {
    if (!horizontal && Math.abs(height) < 17) {
      return null;
    }
    if (horizontal && Math.abs(width) < 20) {
      return null;
    }
    dy = (height + offset * 1.5) / 2;
    // dx = width / 2;
  } else if (defaultLabelPlacement === 'outside') {
    if (horizontal) {
      dy = (height + offset * 1.5) / 2;
      if (text.toString().length < 5) {
        dx = width + offset * 1.7 + 5;
      } else {
        dx = width + offset * 2.7 + 5;
      }
    }
  }

  let content = (
    <g transform={`translate(${x},${y})`}>
      <text
        dx={dx}
        dy={dy}
        textAnchor="middle"
        fill={labelPlacement === 'outside' ? 'black' : labelColor || WHITE}
        style={{fontSize: SMALL_FONT_SIZE, zIndex: 10}}
      >
        {text}
      </text>
    </g>
  );

  if (!horizontal && Math.abs(height) < 17 && labelPlacement !== 'outside') {
    return null;
  }
  if (horizontal && Math.abs(width) < 20 && labelPlacement !== 'outside') {
    return null;
  }
  return content;
}

type TooltipProps = {
  payload: Array<{[key: string]: any}>;
  label: string;
  dataKeyFill?: {[key: string]: string};
  dataKeyLabel?: {[key: string]: string};
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: *) => *;
};

function CustomTooltip(props: TooltipProps) {
  let {
    payload,
    dataKeyFill,
    label,
    dataKeyLabel,
    labelFormatter,
    valueFormatter,
  } = props;
  if (payload == null) {
    return null;
  }
  let dataLabel = (label && labelFormatter && labelFormatter(label)) || label;
  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipTitle}>{dataLabel}</Text>
      {payload.map((data, index) => {
        let color = data.fill;
        if (dataKeyFill) {
          let fill = dataKeyFill[data.dataKey];
          if (fill) {
            if (typeof fill === 'string') {
              color = fill;
            } else if (typeof fill === 'function') {
              color = fill(data.payload);
            }
          }
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
