// @flow

import React from 'react';

import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  // CartesianGrid,
} from 'recharts';
import {StyleSheet} from 'react-primitives';

import splitLongLabel from '../../helpers/splitLongLabel';

import {View, Text} from '../coreUIComponents';
import {WHITE, GREY, LINE_CHART_COLORS} from '../../constants/colors';
import {SMALL_FONT_SIZE} from '../../constants/text';
import {ANIMATION_DURATION} from '../../constants/chartSettings';

import type {ChartDatum} from '../../types/Chart-types';

type Props = {
  data: Array<Array<ChartDatum>>;
  xAxis: string;
  yAxis: string;
  tooltipInfo: string;
  maxAxisLabelLength?: number;
  showAxis?: boolean;
  showLabelValue?: boolean;
  showTooltip?: boolean;
  showChartGrid?: boolean;
  showLegend?: boolean;
  vertical?: boolean;
  width?: number;
  height?: number;
  style?: {
    group?: {[key: string]: *};
    line?: {[key: string]: *};
    scatter?: {[key: string]: *};
    label?: {[key: string]: *};
    tooltip?: {[key: string]: *};
    container?: {[key: string]: *};
    axis?: {[key: string]: *};
  };
  extraProps?: {
    container?: {[key: string]: *};
    xAxis?: {[key: string]: *};
    yAxis?: {[key: string]: *};
    lineChart?: {[key: string]: *};
    line?: {[key: string]: *};
    legend?: {[key: string]: *};
    tooltip?: {[key: string]: *};
  };
  dxLabel?: number;
  dyLabel?: number;
};

const DX_LABEL = 18;
const DY_LABEL = 3;

export function prepareLineChartData(
  rawData: Array<Array<ChartDatum>>,
  xAxis: string,
  yAxis: string,
  tooltipInfo: string,
  vertical: ?boolean,
): {
  tooltipData: Array<string>;
  lineChartData: Array<mixed>;
} {
  let x = xAxis;
  let y = yAxis;
  if (vertical) {
    x = yAxis;
    y = xAxis;
  }
  let lineChartData = {};
  let tooltipData = [];
  for (let data of rawData) {
    for (let datum of data) {
      tooltipData.push(`d_${datum[tooltipInfo]}`);
      lineChartData[datum[x]] = {
        ...lineChartData[datum[x]],
        ...datum,
        [`d_${datum[tooltipInfo]}`]: datum[y],
      };
    }
  }
  return {
    tooltipData: [...new Set(tooltipData)],
    lineChartData: Object.values(lineChartData),
  };
}

export default function LineRecharts(props: Props) {
  let {
    data,
    xAxis,
    yAxis,
    tooltipInfo,
    maxAxisLabelLength,
    showAxis,
    showLabelValue,
    showTooltip,
    showLegend,
    // showChartGrid,
    vertical,
    width,
    height,
    // style, // TODO: pass on style obj to each respective Component
  } = props;
  let extraProps = props.extraProps || {};
  let {tooltipData, lineChartData} = prepareLineChartData(
    data,
    xAxis,
    yAxis,
    tooltipInfo,
    vertical,
  );
  let lines = [];
  let i = 0;
  for (let data of tooltipData) {
    let strokeColor = LINE_CHART_COLORS[i];
    lines.push(
      <Line
        type="monotone"
        key={lines.length}
        dataKey={data}
        stroke={strokeColor}
        animationDuration={ANIMATION_DURATION}
        label={(args) =>
          showLabelValue && (
            <CustomLabel
              {...extraProps.line}
              {...args}
              length={lineChartData.length}
              stroke={strokeColor}
              left
            />
          )}
        {...extraProps.line}
      />,
    );
    lines.push(
      <Line
        type="monotone"
        key={lines.length}
        dataKey={data}
        animationDuration={ANIMATION_DURATION}
        stroke={strokeColor}
        label={(args) =>
          showLabelValue && (
            <CustomLabel
              {...extraProps.line}
              {...args}
              length={lineChartData.length}
              stroke={strokeColor}
              right
            />
          )}
        {...extraProps.line}
      />,
    );
    i += 1;
  }
  return (
    <ResponsiveContainer
      width={width || '100%'}
      height={height || '100%'}
      {...extraProps.container}
    >
      <LineChart
        data={lineChartData}
        layout={vertical ? 'vertical' : 'horizontal'}
        {...extraProps.lineChart}
      >
        {!vertical ? (
          <XAxis
            type="category"
            dataKey={xAxis}
            tick={{fontSize: SMALL_FONT_SIZE, width: 150}}
            tickFormatter={(label) => {
              if (typeof label === 'string' && label !== '') {
                return splitLongLabel(label, maxAxisLabelLength);
              }
            }}
            interval={0}
            tickLine={false}
            axisLine={showAxis || false}
            padding={{left: 30, right: 30}}
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
        {vertical ? (
          <YAxis
            type="category"
            width={120}
            dataKey={xAxis}
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
        {showTooltip &&
          lineChartData.length > 0 && (
            <Tooltip
              content={(args) => <CustomTooltip {...args} />}
              {...extraProps.tooltip}
            />
          )}
        {/* {showChartGrid && <CartesianGrid strokeDasharray="3 3" />} */}
        {showLegend && <Legend {...extraProps.legend} />}
        {lines}
      </LineChart>
    </ResponsiveContainer>
  );
}

type TooltipProps = {
  payload: Array<{[key: string]: any}>;
  label: string;
  dataKeyLabel?: {[key: string]: string};
  labelFormatter?: (label: string) => string;
};

function CustomTooltip(props: TooltipProps) {
  let {payload, label, dataKeyLabel, labelFormatter} = props;
  let noDupePayload = [];
  for (let data of payload) {
    if (!noDupePayload.find((el) => el.name === data.name)) {
      noDupePayload.push(data);
    }
  }
  let dataLabel = label;
  if (label && labelFormatter) {
    dataLabel = labelFormatter(label);
  }
  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipTitle}>{dataLabel}</Text>
      {noDupePayload.map((data, index) => {
        let dataName = data.dataKey.split('d_')[1];
        return (
          <Text key={index} style={{color: data.stroke}}>
            {(dataKeyLabel && dataKeyLabel[dataName]) || dataName}: {data.value}
          </Text>
        );
      })}
    </View>
  );
}

type LabelProps = {
  x: number;
  y: number;
  index: number;
  value: string;
  stroke: string;
  length: number;
  left?: boolean;
  right?: boolean;
  valueFormatter?: (value: string) => string;
};

function CustomLabel(props: LabelProps) {
  const {
    x,
    y,
    index,
    value,
    stroke,
    length,
    left,
    right,
    valueFormatter,
  } = props;
  let dx = 0;
  if (index > 0 && index < length - 1) {
    return null;
  }
  if (left && index === 0) {
    dx = DX_LABEL * -1;
  } else if (right && index === length - 1) {
    dx = DX_LABEL;
  } else {
    return null;
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dx={dx}
        dy={DY_LABEL}
        textAnchor="middle"
        fill={stroke}
        style={{fontSize: SMALL_FONT_SIZE, zIndex: 10}}
      >
        {valueFormatter ? valueFormatter(value) : value}
      </text>
    </g>
  );
  // return null;
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
