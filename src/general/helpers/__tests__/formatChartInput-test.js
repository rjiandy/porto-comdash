// @flow
import formatChartInput from '../formatChartInput';

describe(`formatChartInput`, () => {
  it(`should format the object into array of object based of desired keys`, () => {
    let inputObject = {
      firstName: 'John',
      mathScore: 8,
      physicScore: 10,
    };
    let keys = [
      {from: 'mathScore', to: 'Math'},
      {from: 'physicScore', to: 'Physics'},
    ];
    let result = formatChartInput(inputObject, keys);
    let expected = [{name: 'Math', value: 8}, {name: 'Physics', value: 10}];
    expect(result).toEqual(expected);
  });

  it(`should set default 0 if the key doesn't exist`, () => {
    let inputObject = {
      firstName: 'John',
      mathScore: 8,
      physicScore: 10,
    };
    let keys = [
      {from: 'englishScore', to: 'English'},
      {from: 'physicScore', to: 'Physics'},
    ];
    let result = formatChartInput(inputObject, keys);
    let expected = [{name: 'English', value: 0}, {name: 'Physics', value: 10}];
    expect(result).toEqual(expected);
  });
});
