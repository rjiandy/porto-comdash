// @flow

import commaSeparator from '../commaSeparator';

describe('commaSeparator Test', () => {
  it('should return comma separated number correctly', () => {
    let actual = [
      commaSeparator(123),
      commaSeparator(1234),
      commaSeparator(12345),
      commaSeparator(123456),
      commaSeparator(1234567),
      commaSeparator(12345678),
    ];
    let expected = [
      '123',
      '1,234',
      '12,345',
      '123,456',
      '1,234,567',
      '12,345,678',
    ];
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i]).toBe(expected[i]);
    }
  });

  it('should return the value received if it contains something other than digits', () => {
    let actual = [commaSeparator('123a'), commaSeparator('foo')];
    let expected = ['123a', 'foo'];
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i]).toBe(expected[i]);
    }
  });

  it('should concat with its decimal value', () => {
    let actual = [commaSeparator('11123a.33'), commaSeparator('1123422.44522')];
    let expected = ['11123a.33', '1,123,422.44522'];
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});
