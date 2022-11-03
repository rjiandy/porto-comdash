// @flow

export type IndustrySize = {
  timeMonthID: string;
  monthDesc: string;
  periodType: string;
  territory: string;
  volume: number;
  growth: 'NULL' | number;
  sortOrder: number;
  sortOrderTerritory: number;
};
