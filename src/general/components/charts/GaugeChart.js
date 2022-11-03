// @flow

import React from 'react';
import {Cell, PieChart, Pie, ResponsiveContainer, Tooltip} from 'recharts';
import {StyleSheet} from 'react-primitives';

import {ANIMATION_DURATION} from '../../constants/chartSettings';
import {View, Text} from '../../components/coreUIComponents';
import {WHITE, GREY, GAUGE_CHART_COLOR} from '../../constants/colors';
import {SMALL_FONT_SIZE} from '../../constants/text';
import roundDecimal from '../../helpers/roundDecimal';

type Shape = {
  cx: number;
  cy: number;
  outerRadius: number;
  midAngle: number;
};

type Props = {
  value: number;
  width: number;
  toolTipLabel: string;
  height?: number;
  colorData?: Array<{value: number; color: string}>;
  offset?: number;
};

const DEFAULT_COLOR_DATA = [
  {
    value: 25,
    color: GAUGE_CHART_COLOR.red,
  },
  {
    value: 25,
    color: GAUGE_CHART_COLOR.yellow,
  },
  {
    value: 25,
    color: GAUGE_CHART_COLOR.yellow,
  },
  {
    value: 25,
    color: GAUGE_CHART_COLOR.green,
  },
];

export default function GaugeChart(props: Props) {
  let {height, value: chartValue, width, toolTipLabel, offset} = props;
  let colorData = props.colorData || DEFAULT_COLOR_DATA;
  chartValue = offset ? chartValue - offset : chartValue;

  const activeSectorIndex = colorData
    .map((cur, index, arr) => {
      const curMax = [...arr]
        .splice(0, index + 1)
        .reduce((a, b) => ({value: a.value + b.value})).value;
      return chartValue > curMax - cur.value && chartValue <= curMax;
    })
    .findIndex((cur) => cur);

  const sumValues = colorData.reduce((a, b) => a + b.value, 0);

  const arrowData = [
    {value: chartValue},
    {value: 0},
    {value: sumValues - chartValue},
  ];

  const pieProps = {
    startAngle: 180,
    endAngle: 0,
    cx: width / 2,
    cy: width / 2,
  };

  const pieRadius = {
    outerRadius: width / 2 * 0.7,
  };

  const Arrow = ({cx, cy, midAngle, outerRadius}: Shape) => {
    //eslint-disable-line react/no-multi-comp
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + width * 0.03) * cos;
    const my = cy + (outerRadius + width * 0.03) * sin;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={width * 0.02}
          fill={GAUGE_CHART_COLOR.needle}
          stroke="none"
        />
        <path
          d={`M${cx},${cy}L${mx},${my}`}
          strokeWidth="5"
          stroke={GAUGE_CHART_COLOR.needle}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width={width} height={height || '100%'}>
      <PieChart>
        <Pie
          activeIndex={activeSectorIndex}
          data={colorData}
          animationDuration={ANIMATION_DURATION}
          label={(props: Object) => {
            let {index, value, x, y} = props;
            let offsetX = 0;
            let offsetY = 0;
            if (x <= 50) {
              offsetX = index * -15;
              offsetY = 25 + index * 6;
            } else if (x <= 100) {
              offsetX = index * -15;
              offsetY = 25;
            } else if (x <= 150) {
              offsetX = index * -14;
              offsetY = 15;
            } else if (x <= 180) {
              offsetX = index * -11;
            } else {
              offsetX = index * -7;
              offsetY = -10;
            }
            return (
              <g>
                <text
                  x={x + 5 + offsetX}
                  y={y + offsetY}
                  fontSize={SMALL_FONT_SIZE}
                >
                  {offset + index * value}
                </text>
                {index === colorData.length - 1 && (
                  <text
                    x={x + 7 - index * 5}
                    y={y + 23}
                    fontSize={SMALL_FONT_SIZE}
                  >
                    {offset + (index + 1) * value}
                  </text>
                )}
              </g>
            );
          }}
          labelLine={false}
          {...pieRadius}
          {...pieProps}
        >
          {colorData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colorData[index].color} />
          ))}
        </Pie>
        <Pie
          stroke="none"
          activeIndex={1}
          activeShape={Arrow}
          data={arrowData}
          fill="none"
          {...pieProps}
        />
        <Tooltip
          content={(args: {active: boolean}) => (
            <GaugeChartTooltip
              active={args.active}
              value={chartValue + offset}
              label={toolTipLabel}
            />
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

type ToolTipProps = {
  label: string;
  active: boolean;
  value: number;
};

function GaugeChartTooltip(props: ToolTipProps) {
  const {active, value, label} = props;

  if (active) {
    return (
      <View style={styles.tooltipContainer}>
        <Text>{`${label} : ${roundDecimal(value)}%`}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: WHITE,
    borderColor: GREY,
    borderWidth: 1,
    padding: 10,
  },
});
