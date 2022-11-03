// @flow

import d3 from 'd3';

import {THEME_COLOR, PALE_GREEN} from '../constants/colors';

type Data = Array<*>;
type ColorRange = {
  start: string;
  end: string;
};

function getColorScale(data: Data, colorRange?: ColorRange) {
  return d3.scale
    .linear()
    .domain([0, data.length])
    .interpolate(d3.interpolateHcl)
    .range([
      d3.rgb((colorRange && colorRange.start) || THEME_COLOR),
      d3.rgb((colorRange && colorRange.end) || PALE_GREEN),
    ]);
}

export default getColorScale;
