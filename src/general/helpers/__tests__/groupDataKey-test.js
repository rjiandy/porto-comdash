// @flow

import groupDataByKeyToMap from '../groupDataByKeyToMap';

describe('groupDataByKeyToMap', () => {
  it('Should group list of data by desired key', () => {
    let mockData = [
      {
        brandSku: 'UML1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
      {
        brandSku: 'UML1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
      {
        brandSku: 'MBR1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
      {
        brandSku: 'MBR1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
    ];
    let result = groupDataByKeyToMap(mockData, 'brandSku');
    let expected = new Map();
    expected.set('UML1', [
      {
        brandSku: 'UML1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
      {
        brandSku: 'UML1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
    ]);
    expected.set('MBR1', [
      {
        brandSku: 'MBR1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
      {
        brandSku: 'MBR1',
        weekOne: '1000',
        weekTwo: '1000',
        weekThree: '1000',
      },
    ]);
    expect(result).toEqual(expected);
  });
});
