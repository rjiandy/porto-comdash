// @flow

import React from 'react';
import toJSON from 'enzyme-to-json';

import {shallow} from 'enzyme';

import StackedBarRechart, {
  prepareStackedBarChartData,
} from '../StackedBarRechart';

const data: Array<Object> = [
  {name: 'a', value: 25, info: 'foo', fill: 'red'},
  {name: 'a', value: 15, info: 'bar', fill: 'green'},
  {name: 'a', value: 5, info: 'baz', fill: 'blue'},
  {name: 'a', value: 55, info: 'bam', fill: 'yellow'},
];

describe('prepareStackedBarChartData', () => {
  it('Should convert victory shaped data to recharts shaped data', () => {
    let victoryShaped: Array<Array<Object>> = [
      [
        {name: 'a', value: 25, info: 'foo', fill: 'red'},
        {name: 'b', value: 5, info: 'foo', fill: 'red'},
      ],
      [
        {name: 'a', value: 15, info: 'bar', fill: 'green'},
        {name: 'b', value: 10, info: 'bar', fill: 'green'},
      ],
      [
        {name: 'a', value: 5, info: 'baz', fill: 'blue'},
        {name: 'b', value: 15, info: 'baz', fill: 'blue'},
      ],
    ];
    let actual = prepareStackedBarChartData(
      victoryShaped,
      'name',
      'value',
      'info'
    );
    let expected = {
      tooltipData: ['d_foo', 'd_bar', 'd_baz'],
      stackedBarChartData: [
        {
          name: 'a',
          value: 5,
          info: 'baz',
          d_foo: 25,
          d_foo_fill: 'red',
          d_bar: 15,
          d_bar_fill: 'green',
          d_baz: 5,
          d_baz_fill: 'blue',
        },
        {
          name: 'b',
          value: 15,
          info: 'baz',
          d_foo: 5,
          d_foo_fill: 'red',
          d_bar: 10,
          d_bar_fill: 'green',
          d_baz: 15,
          d_baz_fill: 'blue',
        },
      ],
    };
    expect(actual).toEqual(expected);
  });
  it('Should convert recharts shaped data', () => {
    let actual = prepareStackedBarChartData(data, 'name', 'value', 'info');
    let expected = {
      tooltipData: ['d_foo', 'd_bar', 'd_baz', 'd_bam'],
      stackedBarChartData: [
        {
          name: 'a',
          value: 55,
          info: 'bam',
          d_foo: 25,
          d_foo_fill: 'red',
          d_bar: 15,
          d_bar_fill: 'green',
          d_baz: 5,
          d_baz_fill: 'blue',
          d_bam: 55,
          d_bam_fill: 'yellow',
        },
      ],
    };
    expect(actual).toEqual(expected);
  });
});

describe('StackedBarRechart', () => {
  it('Should render stacked bar chart correctly', () => {
    let stackedBarChart = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
      />
    );
    expect(toJSON(stackedBarChart)).toMatchSnapshot();
  });

  it('Should render horizontal stacked bar chart correctly', () => {
    let stackedBarChartHorizontal = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
        horizontal
      />
    );
    expect(toJSON(stackedBarChartHorizontal)).toMatchSnapshot();
  });

  it('Should render stacked bar chart axis correctly', () => {
    let stackedBarChartWithAxis = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
        showAxis
      />
    );
    expect(toJSON(stackedBarChartWithAxis)).toMatchSnapshot();
    let stackedBarChartHorizontalWithAxis = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
        horizontal
        showAxis
      />
    );
    expect(toJSON(stackedBarChartHorizontalWithAxis)).toMatchSnapshot();
  });

  it('Should render stacked bar chart tooltip correctly', () => {
    let stackedBarChartWithTooltip = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
        showTooltip
      />
    );
    expect(toJSON(stackedBarChartWithTooltip)).toMatchSnapshot();
  });

  it('Should render stacked bar chart legend correctly', () => {
    let stackedBarChartWithLegend = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
        showLegend
      />
    );
    expect(toJSON(stackedBarChartWithLegend)).toMatchSnapshot();
  });

  it('Should render stacked bar chart axis ticks correctly', () => {
    let stackedBarChartWithTickLabelPosition = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
        tickLabelPosition="right"
      />
    );
    expect(toJSON(stackedBarChartWithTickLabelPosition)).toMatchSnapshot();
    let stackedBarChartHorizontalWithTickLabelPosition = shallow(
      <StackedBarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tooltipInfo="info"
        horizontal
        tickLabelPosition="right"
      />
    );
    expect(
      toJSON(stackedBarChartHorizontalWithTickLabelPosition)
    ).toMatchSnapshot();
  });
});
