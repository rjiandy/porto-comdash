// @flow

import React from 'react';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

import Detail from '../Detail';

it('should render Header component correctly', () => {
  let data = [
    {
      territory: 'Ambon',
      oohType: 'All',
      itemType: 'SITE',
      label: 'HMS',
      measure: 30,
    },
  ];
  let rendered = shallow(
    <Detail data={data} selectedTerritory="Ambon" selectedType="All" />
  );

  expect(toJSON(rendered)).toMatchSnapshot();
});
