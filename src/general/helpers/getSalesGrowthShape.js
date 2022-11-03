// @flow
import React from 'react';
import {
  Triangle,
  Rectangle,
} from '../components/shapesComponent';
import getGrowthColor from './getGrowthColor';

export default function getSalesGrowthShape(salesGrowth: number) {
  if (salesGrowth <= -0.3) {
    return (
      <Triangle
        size={1.5}
        orientation="down"
        color={getGrowthColor(salesGrowth)}
      />
    );
  } else if (salesGrowth > -0.3 && salesGrowth < 0.3) {
    return (
      <Rectangle size={1.5} backgroundColor={getGrowthColor(salesGrowth)} />
    );
  } else if (salesGrowth >= 0.3) {
    return (
      <Triangle size={1.5} color={getGrowthColor(salesGrowth)} />
    );
  }
}
