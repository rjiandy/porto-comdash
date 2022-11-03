// @flow

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip,
  Legend,
} from 'recharts';
import {StyleSheet} from 'react-primitives';

import getColorScale from '../../helpers/getColorScale';
import roundDecimal from '../../helpers/roundDecimal';

import {View, Text} from '../coreUIComponents';
import {WHITE, GREY} from '../../constants/colors';
import {SMALL_FONT_SIZE} from '../../constants/text';
import {ANIMATION_DURATION} from '../../constants/chartSettings';

import type {ChartDatum} from '../../types/Chart-types';

type Props = {
  width?: number;
  height?: number;
  data: Array<ChartDatum>;
  xAxis: string;
  yAxis: string;
  showTooltip?: boolean;
  showLegend?: boolean;
  labelPosition?: 'inner' | 'outer';
  centerText?: string;
  extraProps?: {
    pieChart?: {[key: string]: any};
    pie?: {[key: string]: any};
    pieLabel?: {[key: string]: any};
    cell?: {[key: string]: any};
    legend?: {[key: string]: any};
  };
};

function PieChartComponent(props: Props) {
  let {
    width,
    height,
    data,
    xAxis,
    yAxis,
    centerText,
    showTooltip,
    showLegend,
  } = props;
  let labelPosition = props.labelPosition || 'inner';
  let extraProps = props.extraProps || {};
  let formattedData = formatData({data, xAxis, yAxis});
  let COLORS = getColorScale(data);
  return (
    <ResponsiveContainer width={width || '100%'} height={height || '100%'}>
      <PieChart {...extraProps.pieChart}>
        <Pie
          animationDuration={ANIMATION_DURATION}
          data={formattedData}
          labelLine={false}
          label={(args) => (
            <RenderLabel
              {...extraProps.pieLabel}
              {...args}
              labelPosition={labelPosition}
            />
          )}
          {...extraProps.pie}
        >
          {formattedData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.fill || COLORS(index)}
              {...extraProps.cell}
            />
          ))}
          {centerText && <Label value={centerText} position="center" />}
        </Pie>
        {data.length > 0 &&
        showTooltip && (
          <Tooltip content={(args) => <CustomTooltip {...args} />} />
        )}
        {showLegend && <Legend {...extraProps.legend} />}
      </PieChart>
    </ResponsiveContainer>
  );
}

type TooltipProps = {
  payload: Array<{[key: string]: any}>;
  label: string;
  dataKeyLabel?: {[key: string]: string};
  labelFormatter?: (label: string) => string;
};

export function CustomTooltip(props: TooltipProps) {
  let {payload, labelFormatter} = props;
  let data = payload[0] ? payload[0].payload : {};
  let dataLabel = data.actualValue;
  if (labelFormatter) {
    dataLabel = labelFormatter(dataLabel);
  }
  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipTitle}>{data.name}</Text>
      <Text>{dataLabel}</Text>
    </View>
  );
}

type LabelProps = {
  x: number;
  y: number;
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  index: number;
  fill: string;
  value: number;
  labelPosition: 'inner' | 'outer';
  labelFormatter?: (value: number) => string;
};

function RenderLabel(props: LabelProps) {
  let {
    x,
    y,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
    labelPosition,
    labelFormatter,
  } = props;
  let xPos = x;
  let yPos = y;
  if (labelPosition === 'inner') {
    if (percent < 0.05) {
      return null;
    }
    let {x, y} = calculatingCenterPosition({
      cx,
      cy,
      innerRadius,
      outerRadius,
      midAngle,
    });
    xPos = x;
    yPos = y;
  }
  let label = value;
  if (labelFormatter) {
    label = labelFormatter(value);
  }
  return (
    <text
      x={xPos}
      y={yPos}
      fill={labelPosition === 'inner' ? 'white' : 'black'}
      fontSize={SMALL_FONT_SIZE}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}%
    </text>
  );
}

type CenterPostitionProp = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  midAngle: number;
};

function calculatingCenterPosition(prop: CenterPostitionProp) {
  let {cx, cy, innerRadius, outerRadius, midAngle} = prop;
  let radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  let RADIAN = Math.PI / 180;
  return {
    x: cx + radius * Math.cos(-midAngle * RADIAN),
    y: cy + radius * Math.sin(-midAngle * RADIAN),
  };
}

type FormatDataProps = {
  data: Array<ChartDatum>;
  xAxis: string;
  yAxis: string;
};

function formatData(props: FormatDataProps) {
  let {xAxis, yAxis, data} = props;
  let sum = data.reduce((total, prev) => total + prev[yAxis], 0);
  return data.map((data) => {
    return {
      name: data[xAxis],
      value: roundDecimal(data[yAxis] / sum * 100),
      actualValue: data[yAxis],
      fill: data.fill,
    };
  });
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

export default PieChartComponent;
