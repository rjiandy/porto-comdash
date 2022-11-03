// @flow

import type {IndustrySize} from '../types/IndustrySize-type';

export default function getMATValue(data: Array<IndustrySize>, today: Date) {
  let last12Months = [];
  for (let i = 0; i < 12; i++) {
    let date = new Date(today);
    let previousMonth = new Date(date.setUTCMonth(date.getUTCMonth() - i));
    let year = previousMonth.getUTCFullYear();
    let month = String(previousMonth.getUTCMonth() + 1).padStart(2, '0');
    last12Months.push(`${year}${month}`);
  }
  return data
    .filter((datum) => {
      return last12Months.includes(String(datum.timeMonthID));
    })
    .map(({volume}) => volume)
    .reduce((a, b) => a + b, 0);
}
