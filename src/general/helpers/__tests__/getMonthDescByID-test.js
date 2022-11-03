// @flow

import getMonthDescByID from '../getMonthDescByID';

it('should return month desc correctly by its id', () => {
  expect(getMonthDescByID('201704')).toBe('Apr-17');
  expect(getMonthDescByID('201712')).toBe('Dec-17');
});
