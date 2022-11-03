// @flow

export type IMSComparisonDatum = {
  category: string;
  brandFamily: string;
  territory: string;
  product: string;
  volCurrentWeek: number;
  volLastFourWeek: number;
  volVariance: number;
  volYTD: number;
  volYTDLastYear: number;
  volYTDVariance: number;
  objectiveYTD: number;
  objectiveYTDLastYear: number | 'NULL';
  objectiveYTDVariance: number | 'NULL';
  objectiveAchievement: number | 'NULL';
  brandType: '1' | '2' | '3';
  sortOrderTerritory: number;
  sortOrderCompany: number;
};

export type BrandFilters =
  | 'BRAND'
  | 'BRAND_FAMILY'
  | 'BRAND_SKU'
  | 'BRAND_VARIANT';

export type IMSComparisonState = {
  imsComparisonData: Array<IMSComparisonDatum>;
  isImsComparisonWidgetLoading: boolean;
  error: ?Error;
};

export type IMSComparisonAction =
  | {
      type: 'FETCH_IMS_COMPARISON_DATA_REQUESTED';
    }
  | {
      type: 'FETCH_IMS_COMPARISON_DATA_SUCCEED';
      data: Array<IMSComparisonDatum>;
    }
  | {
      type: 'FETCH_IMS_COMPARISON_DATA_FAILED';
      error: ?Error;
    };
