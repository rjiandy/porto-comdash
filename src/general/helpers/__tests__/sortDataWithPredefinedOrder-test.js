// @flow

import sortDataWithPredefinedOrder from '../sortDataWithPredefinedOrder';

it('should re-order the data according to the predefined value', () => {
  let predefinedOrder = ['sampoerna a', 'mild b', 'u-mild', 'dss kretek'];
  let data = [
    {
      name: 'DSS Kretek',
      growth: 0.3,
    },
    {
      name: 'MILD B',
      growth: 0.5,
    },
    {
      name: 'Sampoerna A',
      growth: 0.4,
    },
    {
      name: 'U-Mild',
      growth: 0.8,
    },
  ];

  let sortedData = sortDataWithPredefinedOrder(predefinedOrder, data, 'name');
  expect(sortedData).toEqual([
    {
      name: 'Sampoerna A',
      growth: 0.4,
    },
    {
      name: 'MILD B',
      growth: 0.5,
    },
    {
      name: 'U-Mild',
      growth: 0.8,
    },
    {
      name: 'DSS Kretek',
      growth: 0.3,
    },
  ]);
});
