// @flow

import React from 'react';
import toJSON from 'enzyme-to-json';

import {shallow} from 'enzyme';

import OverlappedBarRechart from '../OverlappedBarRechart';

const data = [
  {name: 'a', valueX: 25, valueY: 20},
  {name: 'b', valueX: 15, valueY: 5},
  {name: 'c', valueX: 5, valueY: 25},
  {name: 'd', valueX: 55, valueY: 35},
];
describe('OverlappedBarRechart', () => {
  it('Should render overlapped bar chart correctly', () => {
    let overlappedBarChart = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
      />
    );
    expect(toJSON(overlappedBarChart)).toMatchSnapshot();
  });

  it('Should render horizontal overlapped bar chart correctly', () => {
    let overlappedBarChartHorizontal = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        horizontal
      />
    );
    expect(toJSON(overlappedBarChartHorizontal)).toMatchSnapshot();
  });

  it('Should render overlapped bar chart axis correctly', () => {
    let overlappedBarChartWithAxis = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        showAxis
      />
    );
    expect(toJSON(overlappedBarChartWithAxis)).toMatchSnapshot();
    let overlappedBarChartHorizontalWithAxis = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        horizontal
        showAxis
      />
    );
    expect(toJSON(overlappedBarChartHorizontalWithAxis)).toMatchSnapshot();
  });

  it('Should render overlapped bar chart tooltip correctly', () => {
    let overlappedBarChartWithTooltip = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        showTooltip
      />
    );
    expect(toJSON(overlappedBarChartWithTooltip)).toMatchSnapshot();
  });

  it('Should render overlapped bar chart legend correctly', () => {
    let overlappedBarChartWithLegend = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        showLegend
      />
    );
    expect(toJSON(overlappedBarChartWithLegend)).toMatchSnapshot();
  });

  it('Should render overlapped bar chart grid correctly', () => {
    let overlappedBarChartWithLegend = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        showChartGrid
      />
    );
    expect(toJSON(overlappedBarChartWithLegend)).toMatchSnapshot();
  });

  it('Should render overlapped bar chart axis ticks correctly', () => {
    let overlappedBarChartWithTickLabelPosition = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        tickLabelPosition="right"
      />
    );
    expect(toJSON(overlappedBarChartWithTickLabelPosition)).toMatchSnapshot();
    let overlappedBarChartHorizontalWithTickLabelPosition = shallow(
      <OverlappedBarRechart
        data={data}
        yAxis={['valueX', 'valueY']}
        xAxis="name"
        horizontal
        tickLabelPosition="right"
      />
    );
    expect(
      toJSON(overlappedBarChartHorizontalWithTickLabelPosition)
    ).toMatchSnapshot();
  });
});
