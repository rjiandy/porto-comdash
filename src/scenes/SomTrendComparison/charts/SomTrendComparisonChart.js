// @flow

import React from 'react';

import LineRechart from '../../../general/components/charts/LineRechart';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';

import type {SomTrendComparisonData} from '../types/SomTrendComparison-type';

type Props = {
  data: Array<Array<SomTrendComparisonData & {fill?: string}>>;
  tooltip: 'product' | 'territory';
};

export default function SomTrendComparisonChart(props: Props) {
  let {data, tooltip} = props;
  return (
    <LineRechart
      xAxis="monthID"
      yAxis="som"
      tooltipInfo={tooltip}
      data={data}
      showLabelValue
      showTooltip
      showChartGrid
      extraProps={{
        xAxis: {
          tickFormatter: (label) => getMonthDescByID(String(label)),
        },
        tooltip: {
          labelFormatter: (label) => getMonthDescByID(String(label)),
        },
      }}
    />
  );
}
