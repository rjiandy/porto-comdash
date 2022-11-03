// @flow

import roundDecimal from '../roundDecimal';

it('should convert decimal to one number behind comma as default', () => {
  let number = 0.344;
  let rounded = roundDecimal(number);
  expect(typeof rounded).toBe('number');
  expect(rounded).toBe(0.3);

  let string = '0.344';
  rounded = roundDecimal(string);
  expect(typeof rounded).toBe('number');
  expect(rounded).toBe(0.3);
});

it('should convert decimal to fixed number behind comma according to its params', () => {
  let number = 0.344;
  let rounded = roundDecimal(number, 2);
  expect(typeof rounded).toBe('number');
  expect(rounded).toBe(0.34);
});

it('should return the original value if the type is NaN', () => {
  let string = 'something';
  let rounded = roundDecimal(string);
  expect(typeof rounded).toBe('string');
  expect(rounded).toBe('something');
});
