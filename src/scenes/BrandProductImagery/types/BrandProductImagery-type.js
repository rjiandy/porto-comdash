// @flow
export type BrandProductImageryDatum = {
  territory: string;
  itemType: string;
  product: string;
  smokerProfile: string;
  imagery: string;
  measure: number;
  lastUpdate: number;
};

export type BrandProductImageryData = Array<BrandProductImageryDatum>;

export type BrandProductImageryState = {
  data: BrandProductImageryData;
  isLoading: boolean;
  error: ?Error;
};

export type BrandProductImageryAction =
  | {
      type: 'FETCH_BRAND_PRODUCT_IMAGERY_REQUESTED';
    }
  | {
      type: 'FETCH_BRAND_PRODUCT_IMAGERY_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_BRAND_PRODUCT_IMAGERY_SUCCEED';
      data: BrandProductImageryData;
    };
