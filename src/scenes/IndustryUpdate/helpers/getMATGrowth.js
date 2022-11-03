// @flow

import getMATValue from './getMATValue';

import type {IndustrySize} from '../types/IndustrySize-type';

export default function getMATGrowth(data: Array<IndustrySize>, today: Date) {
  let thisYeardate = new Date(today);
  let lastYearDate = new Date(
    thisYeardate.setUTCFullYear(thisYeardate.getUTCFullYear() - 1)
  );
  let matValue = getMATValue(data, today);
  let olderMatValue = getMATValue(data, lastYearDate);
  if (!matValue && !olderMatValue) {
    return 0;
  }

  return (matValue - olderMatValue) / olderMatValue;
}
