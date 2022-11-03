// @flow

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {StyleSheet} from 'react-primitives';
import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import {
  DARKER_BLUE,
  PALE_RED,
  LIGHT_GREY,
  GREY,
} from '../../../general/constants/colors';
import {SMALL_FONT_SIZE} from '../../../general/constants/text';

import commaSeparator from '../../../general/helpers/commaSeparator';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';

import type {
  DistributionPerfomanceSomDatum,
  DistributionPerformanceSom,
} from '../types/DistributionPerformanceSom-type';

type Props = {
  data: Map<string, DistributionPerformanceSom>;
  maxSelectedProduct: number;
};

const DX_LABEL = 18;
const DY_LABEL = 3;

export default function SomPriceTrendChart(props: Props) {
  let {data, maxSelectedProduct} = props;
  let charts = [];
  for (let [key, value] of data) {
    let dataProduct = value;
    charts.push(
      <View key={key} style={styles.item}>
        <Text style={{fontSize: 20, textAlign: 'center'}}>{key}</Text>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart
            data={dataProduct}
            margin={{top: 20, right: 0, left: 0, bottom: 10}}
          >
            <XAxis
              dataKey="monthID"
              padding={{left: 30, right: 30}}
              axisLine={false}
              tickLine={false}
              hide={true}
              tick={false}
            />
            <YAxis
              yAxisId="pricePerPack"
              orientation="left"
              axisLine={false}
              tickLine={false}
              hide={true}
              domain={[5000, 'dataMax + 5000']}
            />
            <YAxis
              yAxisId="som"
              orientation="right"
              axisLine={false}
              tickLine={false}
              hide={true}
            />
            <Tooltip content={SOMTooltip} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              yAxisId="pricePerPack"
              dataKey="pricePerPack"
              stroke={PALE_RED}
              label={(args) => (
                <CustomizedLabel {...args} length={dataProduct.length} left />
              )}
            />
            <Line
              type="monotone"
              yAxisId="pricePerPack"
              dataKey="pricePerPack"
              stroke={PALE_RED}
              label={(args) => (
                <CustomizedLabel {...args} length={dataProduct.length} right />
              )}
            />
            <Line
              type="monotone"
              yAxisId="som"
              dataKey="som"
              stroke={DARKER_BLUE}
              label={(args) => (
                <CustomizedLabel {...args} length={dataProduct.length} left />
              )}
            />
            <Line
              type="monotone"
              yAxisId="som"
              dataKey="som"
              stroke={DARKER_BLUE}
              label={(args) => (
                <CustomizedLabel {...args} length={dataProduct.length} right />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </View>,
    );
  }

  if (charts.length < maxSelectedProduct) {
    for (let i = charts.length; i < maxSelectedProduct; i++) {
      charts.push(
        <View key={i} style={styles.item}>
          <PlaceholderView text="Please select another product to compare" />
        </View>,
      );
    }
  }

  return <View style={styles.root}>{charts}</View>;
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
};

function CustomizedLabel(props: LabelProps) {
  const {x, y, index, value, stroke, length, left, right} = props;
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
        style={{fontSize: SMALL_FONT_SIZE - 3, zIndex: 10}}
      >
        {commaSeparator(value)}
      </text>
    </g>
  );
}

type Payload = {
  dataKey: string;
  color: string;
  payload: DistributionPerfomanceSomDatum;
};

type TooltipProps = {
  active: boolean;
  label: string;
  payload: Array<Payload>;
};

function SOMTooltip(props: TooltipProps) {
  let {active, payload, label} = props;
  let [data] = payload;
  let dataLabel = (label && getMonthDescByID(String(label))) || label;
  if (active) {
    return (
      <View style={styles.tooltipContainer}>
        <Text fontWeight="bold" style={{marginBottom: 10}}>
          {dataLabel}
        </Text>
        <Text style={{color: PALE_RED}}>
          Price per Pack: {commaSeparator(data.payload.pricePerPack)}
        </Text>
        <Text style={{color: DARKER_BLUE}}>SOM: {data.payload.som}</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderTopWidth: 0.4,
    borderBottomWidth: 0.4,
    borderColor: LIGHT_GREY,
  },
  item: {
    flex: 1,
    borderLeftWidth: 0.3,
    borderRightWidth: 0.3,
    borderColor: LIGHT_GREY,
    paddingHorizontal: 10,
  },
  tooltipContainer: {
    padding: 10,
    maxWidth: 300,
    backgroundColor: 'white',
    borderColor: GREY,
    borderWidth: 0.5,
  },
});
