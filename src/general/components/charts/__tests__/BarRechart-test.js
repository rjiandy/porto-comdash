// @flow

import React from 'react';
import toJSON from 'enzyme-to-json';

import {shallow} from 'enzyme';

import BarRechart from '../BarRechart';

const data = [
  {name: 'a', value: 25},
  {name: 'b', value: 15},
  {name: 'c', value: 5},
  {name: 'd', value: 55},
];
describe('BarRechart', () => {
  it('Should render bar chart correctly', () => {
    let barChart = shallow(
      <BarRechart data={data} yAxis="value" xAxis="name" />
    );
    expect(toJSON(barChart)).toMatchSnapshot();
  });

  it('Should render horizontal bar chart correctly', () => {
    let barChartHorizontal = shallow(
      <BarRechart data={data} yAxis="value" xAxis="name" horizontal />
    );
    expect(toJSON(barChartHorizontal)).toMatchSnapshot();
  });

  it('Should render bar chart axis correctly', () => {
    let barChartWithAxis = shallow(
      <BarRechart data={data} yAxis="value" xAxis="name" showAxis />
    );
    expect(toJSON(barChartWithAxis)).toMatchSnapshot();
    let barChartHorizontalWithAxis = shallow(
      <BarRechart data={data} yAxis="value" xAxis="name" horizontal showAxis />
    );
    expect(toJSON(barChartHorizontalWithAxis)).toMatchSnapshot();
  });

  it('Should render bar chart tooltip correctly', () => {
    let barChartWithTooltip = shallow(
      <BarRechart data={data} yAxis="value" xAxis="name" showTooltip />
    );
    expect(toJSON(barChartWithTooltip)).toMatchSnapshot();
  });

  it('Should render bar chart legend correctly', () => {
    let barChartWithLegend = shallow(
      <BarRechart data={data} yAxis="value" xAxis="name" showLegend />
    );
    expect(toJSON(barChartWithLegend)).toMatchSnapshot();
  });

  it('Should render bar chart grid correctly', () => {
    let barChartWithLegend = shallow(
      <BarRechart data={data} yAxis="value" xAxis="name" showChartGrid />
    );
    expect(toJSON(barChartWithLegend)).toMatchSnapshot();
  });

  it('Should render bar chart axis ticks correctly', () => {
    let barChartWithTickLabelPosition = shallow(
      <BarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        tickLabelPosition="right"
      />
    );
    expect(toJSON(barChartWithTickLabelPosition)).toMatchSnapshot();
    let barChartHorizontalWithTickLabelPosition = shallow(
      <BarRechart
        data={data}
        yAxis="value"
        xAxis="name"
        horizontal
        tickLabelPosition="right"
      />
    );
    expect(toJSON(barChartHorizontalWithTickLabelPosition)).toMatchSnapshot();
  });
});
