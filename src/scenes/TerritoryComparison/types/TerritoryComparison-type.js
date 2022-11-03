// @flow

export type TerritoryComparison = {
  territoryLevel: 'AREA' | 'REGION' | 'ZONE';
  territory: string;
  category: 'BRAND' | 'BRAND_FAMILY' | 'BRAND_SKU' | 'BRAND_VARIANT' | 'HMS';
  brandFamily: string;
  product: string;
  itemType: 'VOL' | 'SOM';
  valueTY: number;
  valuePCT: number;
  territoryParent: string;
  lastUpdate: string;
};
