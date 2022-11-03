// @flow

import React from 'react';

import StackedBarRechart from '../../../general/components/charts/StackedBarRechart';
import commaSeparator from '../../../general/helpers/commaSeparator';
import formatMonthDesc from '../../../general/helpers/formatMonthDesc';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';

import type {CanvasDistributionPrice} from '../types/CanvasDistributionPrice-type';

type Data = Array<CanvasDistributionPrice & {fill: string}>;
type Props = {
  data: Data;
  legendData: Array<{value: number; color: string}>;
};

export default function CanvasPriceStackedBarChart(props: Props) {
  let {data, legendData} = props;
  let formattedPriceData = data
    .sort((a, b) => {
      let sortMonth = Number(a.monthID) - Number(b.monthID);
      if (sortMonth === 0) {
        return a.price - b.price;
      }
      return sortMonth;
    })
    .map(({price, monthDesc, ...others}) => ({
      ...others,
      monthDesc: formatMonthDesc(monthDesc),
      price: commaSeparator(price),
    }));

  // NOTE: the following code is to append nonexisting data which messes the color of the chart
  let priceSet = new Set();
  let monthSet = new Set();
  data.forEach((datum) => {
    priceSet.add(datum.price);
    monthSet.add(datum.monthID);
  });
  for (let monthID of monthSet) {
    for (let price of priceSet) {
      if (
        !formattedPriceData.find(
          (data) =>
            data.monthID === monthID && data.price === commaSeparator(price),
        )
      ) {
        let legend = legendData.find(({value}) => value === price) || {};
        formattedPriceData.push({
          ...formattedPriceData[0],
          fill: legend.color,
          monthID,
          monthDesc: getMonthDescByID(monthID.toString()),
          price: commaSeparator(price),
          pricePCT: 0,
        });
      }
    }
  }
  return (
    <StackedBarRechart
      data={formattedPriceData}
      xAxis="monthDesc"
      yAxis="pricePCT"
      tooltipInfo="price"
      height={170}
      showLabelValue
      showAxis
      showTooltip
      extraProps={{
        tooltip: {
          filterFn: (data) => data.filter(({value}) => value > 0),
        },
        yAxis: {
          domain: [0, 100],
        },
      }}
      style={{
        bar: {
          data: {
            width: 33,
          },
        },
      }}
    />
  );
}
