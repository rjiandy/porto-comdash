### [&laquo; Home](README.md)

# Landing Page Territory And Brand Manager

The design spec of landing page widget is available on `Commercial Dashboard Design Page 2 - 3`. Please refer to the doc to see the visualization.

- [Landing Page](#landing-page-territory-and-brand-manager)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/landingPageTerritoryBrand`

## Types

```js
// @flow

export type TableData = {
  salesData: Array<Sales>;
  rspWspData: ?RspWsp;
};

export type RspWsp = {
  timeWeekId: string;
  territory: string;
  brand: string;
  brandFamily: string;
  brandSku: string;
  canvasPrice: number;
  distPriceWsp: number;
  rspPackPrice: number;
  rspStickPrice: number;
  wspPrice: number;
};

export type Sales = {
  brand: string;
  brandFamily: string;
  brandSku: string;
  itemType: string;
  itemValueWeekOne: number;
  itemValueWeekThree: number;
  itemValueWeekTwo: number;
  territory: string;
  timeWeekId: string;
  volLY: number;
  volTY: number;
  volGrowth: number;
  OB: number;
};

export type SalesGrowth = {
  brand: string;
  brandFamily: string;
  growthLy: number;
  salesCurrentWeek: number;
  salesLyytd: number;
  salesPreviousWeek: number;
  salesYtd: number;
  territory: string;
  timeWeekId: string;
};

export type LandingPageTerritoryManagerAction =
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

export type TerritoryManagerState = {
  salesData: Array<Sales>;
  salesGrowthData: Array<SalesGrowth>;
  rspWspData: Array<RspWsp>;
  territory: string;
  isLoading: boolean;
  error?: Error;
};

```
[^ back to top](#landing-page)
