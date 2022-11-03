import React from 'react';
import {shallow} from 'enzyme';
import wrapComponent from '../wrapComponent';

jest.mock('react-primitives', () => {
  let initialStyle = {
    30: {
      backgroundColor: 'blue',
    },
  };
  return {
    StyleSheet: {
      flatten: jest.fn((styleID) => {
        return initialStyle[styleID] || {};
      }),
    },
  };
});

it('should return the right style with their id', () => {
  let ViewRaw = (props) => {
    return <div {...props} />;
  };
  let styleID = 30;
  let View = wrapComponent(ViewRaw);
  let rendered = shallow(<View style={[styleID]} />);
  expect(rendered.contains(<ViewRaw style={{backgroundColor: 'blue'}} />)).toBe(
    true
  );
});
