// @flow

import React from 'react';

import OverlappedBarRechart from '../../../general/components/charts/OverlappedBarRechart';

import {PALE_RED, PALE_GREEN} from '../../../general/constants/colors';

import type {SwitchingDynamics} from '../types/SwitchingDynamic-type';

type Props = {
  data: SwitchingDynamics;
  maxDomainValue: number;
};

export default function SwitchingDynamicStackedBarChart(props: Props) {
  let {data, maxDomainValue} = props;
  let minDomainValue = maxDomainValue * -1;
  return (
    <OverlappedBarRechart
      data={data}
      height={34}
      xAxis="brand"
      yAxis={['switchInValue', 'switchOutValue', 'switchNet']}
      style={{
        switchInValue: {
          data: {
            width: 34,
            fill: PALE_GREEN,
          },
        },
        switchOutValue: {
          data: {
            width: 34,
            fill: PALE_RED,
          },
        },
        switchNet: {
          data: {
            width: 17,
            fill: 'gold',
          },
        },
      }}
      extraProps={{
        barChart: {
          margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
        xAxis: {
          domain: [minDomainValue, maxDomainValue],
        },
        yAxis: {
          tick: false,
          hide: true,
        },
        switchInValue: {
          label: false,
        },
        switchOutValue: {
          label: false,
        },
        switchNet: {
          labelPlacement: 'outside',
          labelColor: '#000',
        },
      }}
      showLabelValue
      horizontal
    />
  );
}
