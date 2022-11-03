// @flow

import React from 'react';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

import Header from '../Header';

it('should render Header component correctly', () => {
  let data = {
    territory: 'Ambon',
    billboard: 31,
    baliho: 20,
    minibillboard: 30,
    streetsignage: 15,
    others: 11,
  };
  let rendered = shallow(<Header data={data} selectedTerritory="Bali" />);

  expect(toJSON(rendered)).toMatchSnapshot();
});
