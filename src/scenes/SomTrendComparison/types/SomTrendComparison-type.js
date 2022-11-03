// @flow

export type SomTrendComparisonData = {
  monthID: string;
  territory: string;
  brandFamily: ?string;
  category: 'BRAND' | 'BRAND_FAMILY' | 'BRAND_SKU' | 'BRAND_VARIANT';
  product: string;
  som: number;
  somPP: number;
  somGrowth: number;
  lastUpdate: string;
};

export type SomTrendComparison = {
  somTrendComparison: Array<SomTrendComparisonData>;
};

export type SomTrendComparisonState = SomTrendComparison & {
  isLoading: boolean;
  error: ?Error;
};

export type SomTrendComparisonAction =
  | {
      type: 'FETCH_SOM_TREND_COMPARISON_REQUESTED';
    }
  | {
      type: 'FETCH_SOM_TREND_COMPARISON_SUCCEED';
      somTrendComparison: Array<SomTrendComparisonData>;
    }
  | {
      type: 'FETCH_SOM_TREND_COMPARISON_FAILED';
      error: Error;
    };
