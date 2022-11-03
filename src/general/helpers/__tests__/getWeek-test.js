// @flow

import getWeek from '../getWeek';

describe('getWeek by Date Tests', () => {
  it('Should get the right week', () => {
    expect(getWeek(new Date('2017-07-28'))).toEqual(30);
  });
});
