// @flow

import React from 'react';

import StackedBarRechart from '../../../general/components/charts/StackedBarRechart';

import {View, Text} from '../../../general/components/coreUIComponents';
import {Rectangle} from '../../../general/components/shapesComponent';
import sortDataWithPredefinedOrder from '../../../general/helpers/sortDataWithPredefinedOrder';
import {
  PALE_RED,
  PALE_GREEN,
  MAIN_BLUE,
} from '../../../general/constants/colors';

import type {AdultSmokerProfileData} from '../types/AdultSmokerProfile-type';

type Props = {
  data: AdultSmokerProfileData;
};

const BAR_ORDER = ['UPPER', 'MIDDLE 1', 'MIDDLE 2', 'LOWER'];
const COLOR_ORDER = [PALE_RED, PALE_GREEN, MAIN_BLUE, 'salmon'];
const DATA_ORDER = ['Market', 'SKT', 'SKM High Tar', 'SKM Low Tar', 'White'];

export default function SESAdultSmokersChart(props: Props) {
  let {data} = props;
  let groupedDataMap: Map<string, AdultSmokerProfileData> = new Map();
  data.forEach((datum) => {
    let legendType = groupedDataMap.get(datum.legend);
    if (legendType) {
      let newData = [...legendType, datum];
      groupedDataMap.set(datum.legend, newData);
    } else {
      groupedDataMap.set(datum.legend, [datum]);
    }
  });

  let groupedData: Array<AdultSmokerProfileData> = [];
  for (let i = 0; i < BAR_ORDER.length; i++) {
    let legendData = groupedDataMap.get(BAR_ORDER[i]) || [];
    let sortedData = sortDataWithPredefinedOrder(
      DATA_ORDER,
      legendData,
      'product',
    );
    groupedData.push(
      sortedData.map((datum) => ({...datum, fill: COLOR_ORDER[i]})),
    );
  }
  return (
    <View style={{flex: 1}}>
      <StackedBarRechart
        data={groupedData}
        xAxis="product"
        yAxis="measure"
        tooltipInfo="legend"
        showAxis
        showLabelValue
        showTooltip
        showChartGrid
        style={{
          bar: {
            data: {
              width: 50,
            },
          },
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: -15,
        }}
      >
        {COLOR_ORDER.map((color, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Rectangle size={1} backgroundColor={color} />
              <Text style={{paddingLeft: 5}}>{BAR_ORDER[index]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
