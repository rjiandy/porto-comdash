// @flow

import type {
  BubbleChartDataProps,
  BubbleChart,
} from '../types/SegmentPerformance-type';

export default function formatBubbleChart(
  data: Array<BubbleChart>,
): Array<BubbleChartDataProps> {
  let filterZero = data.filter(({somTY}) => somTY !== 0);
  let sortedData = filterZero.sort((a, b) => {
    let somA = a.somTY < 0 ? a.somTY * -1 : a.somTY;
    let somB = b.somTY < 0 ? b.somTY * -1 : b.somTY;
    return somB - somA;
  });
  let slicedData = sortedData.slice(0, 4);
  let formatted = slicedData.map((item) => ({
    _id: item.brand,
    value: item.somTY,
    selected: false,
    somTY: item.somTY,
    somPCT: item.somPCT,
    displayText: item.brand,
    colorValue: item.somPCT < -0.3 ? -1 : item.somPCT > 0.3 ? 1 : 0,
  }));
  return formatted;
}
