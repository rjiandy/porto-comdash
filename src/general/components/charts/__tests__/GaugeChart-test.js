// @flow

import React from 'react';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

import GaugeChart from '../GaugeChart';

it('Should render gauge bar chart correctly', () => {
  let gaugeChart = shallow(
    <GaugeChart value={10.5} width={100} toolTipLabel="Test Tooltip" />
  );
  expect(toJSON(gaugeChart)).toMatchSnapshot();
});
