// @flow

import getColorScale from '../getColorScale';

describe('getColorScale', () => {
  it('should return a color in range', () => {
    let data = [1, 2, 3];
    let colors = getColorScale(data);
    expect(colors(0)).toBe('#4a90e2');
    expect(colors(2)).toEqual('#00c999');
  });

  it('should return color which not in range', () => {
    let data = [];
    let colors = getColorScale(data);
    expect(colors(0)).not.toBe('#fdda65');
  });
});
