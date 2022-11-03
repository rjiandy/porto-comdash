// @flow

import splitArray from '../splitArray';

it('should split the array according to length given', () => {
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let splittedArray = splitArray(array, 4);
  expect(splittedArray.length).toBe(3);
  expect(splittedArray).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10]]);

  array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  splittedArray = splitArray(array, 4);
  expect(splittedArray.length).toBe(3);
  expect(splittedArray).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);
});
