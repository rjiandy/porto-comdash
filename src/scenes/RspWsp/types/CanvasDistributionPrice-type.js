// @flow

export type CanvasDistributionPrice = {
  timeweekID: string;
  monthID: string;
  monthDesc: string;
  territory: string;
  survey: 'Pack Selling Price' | 'Stick Selling Price';
  brandFamily: string;
  brand: string;
  brandSKU: string;
  distPrice: number;
  price: number;
  pricePCT: number;
  areaSource: string;
};
