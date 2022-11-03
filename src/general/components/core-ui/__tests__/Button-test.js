import React from 'react';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

import {Button} from '../Button';

it('should render button', () => {
  let onPress = jest.fn();
  let button = shallow(<Button label="click me" onPress={onPress} />);
  expect(toJSON(button)).toMatchSnapshot();
  button.simulate('touchTap');
  expect(onPress).toBeCalled();
});

it('should render button with type according to props', () => {
  let onPress = jest.fn();
  let button = shallow(
    <Button label="click me" onPress={onPress} secondary={true} />
  );
  expect(toJSON(button).props.style).toMatchSnapshot();
});

it('should render button with label after or before the icon according to props', () => {
  let onPress = jest.fn();
  let button = shallow(
    <Button
      label="click me"
      onPress={onPress}
      icon="mail"
      iconPosition="right"
    />
  );
  expect(button.prop('labelPosition')).toEqual('before');

  button = shallow(
    <Button
      label="click me"
      onPress={onPress}
      icon="mail"
      iconPosition="left"
    />
  );
  expect(button.prop('labelPosition')).toEqual('after');

  button = shallow(
    <Button
      onPress={onPress}
      icon="mail"
    />
  );
  expect(button.prop('labelPosition')).toEqual('after');
});
