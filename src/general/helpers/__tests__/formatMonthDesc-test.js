// @flow

import formatMonthDesc from '../formatMonthDesc';

describe('formatMonthDesc', () => {
  it('should format monthDesc data', () => {
    let monthDesc = '16-MAY';
    let actual = formatMonthDesc(monthDesc);
    let expected = 'MAY-16';
    expect(actual).toBe(expected);
  });
});
