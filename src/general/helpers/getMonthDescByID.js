// @flow

import MONTHS from '../constants/months';

export default function getMonthDescByID(monthID: string) {
  let month = monthID.substr(4, 2);
  let year = monthID.substr(2, 2);
  return `${MONTHS[Number(month) - 1].substr(0, 3)}-${year}`;
}
