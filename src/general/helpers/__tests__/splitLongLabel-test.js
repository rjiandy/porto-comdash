// @flow

import splitLongLabel from '../splitLongLabel';

describe('splitLongLabel', () => {
  it('should split labels with > 21 characters', () => {
    let label = 'hello world foo bar baz';
    let actual = splitLongLabel(label);
    let expected = ['hello world foo bar', 'baz'];
    expect(actual).toEqual(expected);
  });

  it('should not split labels with <= 21 characters', () => {
    let label = 'foo bar';
    let actual = splitLongLabel(label);
    let expected = ['foo bar'];
    expect(actual).toEqual(expected);
    label = 'exactly 21 characters';
    actual = splitLongLabel(label);
    expected = ['exactly 21 characters'];
    expect(actual).toEqual(expected);
  });

  it('should split labels according to max length provided', () => {
    let label = 'hello foo bar';
    let actual = splitLongLabel(label, 7);
    let expected = ['hello', 'foo bar'];
    expect(actual).toEqual(expected);
  });
});
