// @flow

import {SUB_TYPEC, FLAVOR} from '../constants';
import type {SegmentPerformance} from '../types/SegmentPerformance-type';

export default function groupBySubtypecAndFlavor<T: SegmentPerformance>(
  data: Array<T>
): Map<string, Array<T>> {
  let groupedData = new Map();
  for (let typec of SUB_TYPEC) {
    for (let flavorType of FLAVOR) {
      groupedData.set(typec + '-' + flavorType, []);
    }
  }
  for (let datum of data) {
    let {flavor, subTypec} = datum;
    let previousData = groupedData.get(subTypec + '-' + flavor);
    groupedData.set(subTypec + '-' + flavor, previousData ? [...previousData, datum] : [datum]);
  }
  return groupedData;
}
