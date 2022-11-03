// @flow

export type RspWsp = {
  timeWeekId: string;
  territory: string;
  product: ?string;
  brand: string;
  brandFamily: ?string;
  brandSku: string;
  canvasPrice: number;
  distPriceWSP: number;
  rspPackPrice: number;
  rspStickPrice: number;
  wspPrice: number;
};

export type Sales = {
  brand: string;
  brandFamily: ?string;
  product: ?string;
  itemType: string;
  itemValueWeekOne: number;
  itemValueWeekThree: number;
  itemValueWeekTwo: number;
  territory: string;
  timeWeekId: string;
  weekToDate: number;
  volLY: number;
  volTY: number;
  volGrowth: number;
  ob: number;
  obPct: number;
  sortOrderProduct: number;
  sortOrderBrandFamily: number;
  sortOrderTerritory: number;
};

export type TableData = {
  salesData: Array<Sales>;
  rspWspData: ?RspWsp;
};

export type SalesGrowth = {
  brand: string;
  brandFamily: ?string;
  product: ?string;
  growthLy: number;
  salesCurrentWeek: number;
  salesLyytd: number;
  salesPreviousWeek: number;
  salesYtd: number;
  territory: string;
  timeWeekId: string;
  objectivePCT: number;
};

export type LandingPageBrandTerritoryAction =
  | {
      type: 'FETCH_LANDING_PAGE_TERRITORY_SUCCEED';
      sales: Array<Sales>;
      salesGrowth: Array<SalesGrowth>;
      rspWsp: Array<RspWsp>;
    }
  | {
      type: 'FETCH_LANDING_PAGE_TERRITORY_REQUESTED';
    }
  | {
      type: 'FETCH_LANDING_PAGE_TERRITORY_FAILED';
      error: Error;
    };

export type BrandTerritoryState = {
  salesData: Array<Sales>;
  salesGrowthData: Array<SalesGrowth>;
  rspWspData: Array<RspWsp>;
  territory: string;
  isLoading: boolean;
  error: ?Error;
};
