// @flow

import React from 'react';
import toJSON from 'enzyme-to-json';

import {shallow} from 'enzyme';

import LineRechart, {prepareLineChartData} from '../LineRechart';

const data = [
  [
    {name: 'a', group: 'foo', value: 25},
    {name: 'b', group: 'foo', value: 15},
    {name: 'c', group: 'foo', value: 5},
    {name: 'd', group: 'foo', value: 55},
  ],
  [
    {name: 'a', group: 'bar', value: 5},
    {name: 'b', group: 'bar', value: 25},
    {name: 'c', group: 'bar', value: 15},
    {name: 'd', group: 'bar', value: 35},
  ],
];
describe('prepareLineChartData', () => {
  it('Should convert Victory LineChart data to Recharts LineChart data correctly', () => {
    let actual = prepareLineChartData(data, 'name', 'value', 'group');
    let expected = [
      {name: 'a', group: 'bar', value: 5, d_foo: 25, d_bar: 5},
      {name: 'b', group: 'bar', value: 25, d_foo: 15, d_bar: 25},
      {name: 'c', group: 'bar', value: 15, d_foo: 5, d_bar: 15},
      {name: 'd', group: 'bar', value: 35, d_foo: 55, d_bar: 35},
    ];
    expect(actual.lineChartData).toEqual(expected);
    expect(actual.tooltipData).toEqual(['d_foo', 'd_bar']);
  });
});

describe('LineRechart', () => {
  it('Should render line chart correctly', () => {
    let lineChart = shallow(
      <LineRechart data={data} yAxis="value" xAxis="name" tooltipInfo="group" />
    );
    expect(toJSON(lineChart)).toMatchSnapshot();
  });

  it('Should render vertical line chart correctly', () => {
    let lineChartHorizontal = shallow(
      <LineRechart data={data} yAxis="value" xAxis="name" tooltipInfo="group" vertical />
    );
    expect(toJSON(lineChartHorizontal)).toMatchSnapshot();
  });

  it('Should render line chart axis correctly', () => {
    let lineChartWithAxis = shallow(
      <LineRechart data={data} yAxis="value" xAxis="name" tooltipInfo="group" showAxis />
    );
    expect(toJSON(lineChartWithAxis)).toMatchSnapshot();
    let lineChartHorizontalWithAxis = shallow(
      <LineRechart data={data} yAxis="value" xAxis="name" tooltipInfo="group" vertical showAxis />
    );
    expect(toJSON(lineChartHorizontalWithAxis)).toMatchSnapshot();
  });

  it('Should render line chart tooltip correctly', () => {
    let lineChartWithTooltip = shallow(
      <LineRechart data={data} yAxis="value" xAxis="name" tooltipInfo="group" showTooltip />
    );
    expect(toJSON(lineChartWithTooltip)).toMatchSnapshot();
  });

  it('Should render line chart legend correctly', () => {
    let lineChartWithLegend = shallow(
      <LineRechart data={data} yAxis="value" xAxis="name" tooltipInfo="group" showLegend />
    );
    expect(toJSON(lineChartWithLegend)).toMatchSnapshot();
  });
});
