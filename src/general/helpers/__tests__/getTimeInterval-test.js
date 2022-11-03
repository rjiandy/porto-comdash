// @flow

import getTimeInterval from '../getTimeInterval';

describe('getTimeInterval Tests', () => {
  it('should get the right time interval', () => {
    let mockData = [
      {
        timeOne: new Date('September 25, 2017 17:20'),
        timeTwo: new Date('September 25, 2017 17:25'),
      },
      {
        timeOne: new Date('September 25, 2017 17:20'),
        timeTwo: new Date('September 25, 2017 19:20'),
      },
      {
        timeOne: new Date('September 25, 2017 17:20'),
        timeTwo: new Date('September 26, 2017 17:20'),
      },
      {
        timeOne: new Date('September 25, 2017 17:20'),
        timeTwo: new Date('September 30, 2017 17:20'),
      },
    ];
    let result = [];
    mockData.map(({timeOne, timeTwo}) =>
      result.push(getTimeInterval(timeOne, timeTwo))
    );
    let expected = [
      {interval: 5, timeUnit: 'minute'},
      {interval: 2, timeUnit: 'hour'},
      {interval: 1, timeUnit: 'day'},
      {interval: 5, timeUnit: 'day'},
    ];
    expect(result).toEqual(expected);
  });
});
