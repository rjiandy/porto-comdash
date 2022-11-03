// @flow

import React from 'react';

import StackedBarRechart from '../../../general/components/charts/StackedBarRechart';

import {View, Text} from '../../../general/components/coreUIComponents';
import {Rectangle} from '../../../general/components/shapesComponent';
import {AGE_COLORS} from '../../../general/constants/colors';

import type {ConsumerProfileDatum} from '../types/ConsumerProfile-type';

type Props = {
  data: Array<Array<ConsumerProfileDatum>>;
};

const COLORS = {
  AGE: AGE_COLORS,
  SES: [
    '#DDA0DD',
    '#FF6347',
    '#9ACD32',
    '#00CED1',
    '#6B8E23',
    '#FAA460',
    '#D2B48C',
    '#FFD700',
  ],
};

export default function ConsumerProfileStackedBarChart(props: Props) {
  let {data} = props;

  // NOTE: group data by legend instead of product
  let legendSet = new Set();
  data.forEach((datum) => datum.forEach((d) => legendSet.add(d.legend)));
  let legendArray = Array.from(legendSet).sort();
  let colors = COLORS.SES;
  if (data[0] && data[0][0] && data[0][0].itemType === 'AGE') {
    let lowerAge = legendArray.pop();
    legendArray.unshift(lowerAge);
    colors = COLORS.AGE;
  }
  let legendGrouped = new Map();
  legendArray.forEach((legend, index) => {
    data.forEach((datum) => {
      let newData;
      newData = legendGrouped.get(legend);
      if (!Array.isArray(newData)) {
        newData = [];
      }
      let dataIdx = datum.findIndex((d) => d.legend === legend);
      if (dataIdx > -1) {
        newData.push({
          ...datum[dataIdx],
          fill: colors[index],
        });
      } else {
        // NOTE: if the data doesn't exist (not all data has all legends),
        //       create one with 0 measure to avoid chart errors
        newData.push({
          ...datum[0],
          legend,
          measure: 0,
          fill: colors[index],
        });
      }
      legendGrouped.set(legend, newData);
    });
  });
  let legendGroupedData: Array<Array<ConsumerProfileDatum & {fill: string}>> = Array.from(legendGrouped.values());

  // NOTE: calculate totals & percentage because the data doesn't repesent 100% data
  let legendGroupedDataPct: Array<Array<ConsumerProfileDatum & {fill: string}>> = [];
  if (legendGroupedData.length > 0) {
    let totals = legendGroupedData[0].map((data, i) => {
      return legendGroupedData.reduce((memo, curr) => {
        return memo + curr[i].measure;
      }, 0);
    });
    legendGroupedDataPct = legendGroupedData.map((data) => {
      return data.map((datum, i) => {
        return {
          ...datum,
          measurePct: Number(datum.measure / totals[i] * 100).toFixed(1),
        };
      });
    });
  }
  return (
    <View style={{flex: 1}}>
      <StackedBarRechart
        data={legendGroupedDataPct}
        xAxis="product"
        yAxis="measurePct"
        tooltipInfo="legend"
        extraProps={{
          barChart: {
            margin: {top: 5, right: 5, bottom: 0, left: 5},
          },
        }}
        showLabelValue
        showAxis
        showTooltip
        showChartGrid
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        {legendGroupedDataPct.map((data, index) => (
          <View
            key={index}
            style={{flexDirection: 'row', alignItems: 'center'}}
          >
            <Rectangle size={1} backgroundColor={data[0].fill} />
            <Text style={{marginLeft: 3}}>{data[0].legend}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
