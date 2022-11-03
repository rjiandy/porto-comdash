// @flow

import {GROWTH_COLOR} from '../constants/colors';

export default function getGrowthColor(growth: number) {
  if (growth >= 0.3) {
    return GROWTH_COLOR.high;
  } else if (growth > -0.3 && growth < 0.3) {
    return GROWTH_COLOR.middle;
  } else if (growth <= -0.3) {
    return GROWTH_COLOR.low;
  } else {
    return GROWTH_COLOR.default;
  }
}
