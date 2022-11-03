// @flow

export type DistributionPerfomanceSomDatum = {
  monthID: string;
  monthDesc: string;
  territory: string;
  brandFamily: string;
  product: string;
  som: number;
  pricePerPack: number;
  wdl: number;
  woos: number;
  lastUpdate: string;
};

export type DistributionPerformanceSom = Array<DistributionPerfomanceSomDatum>;

export type DistributionPerformanceSomState = {
  data: DistributionPerformanceSom;
  isLoading: boolean;
  error: ?Error;
};

export type DistributionPerformanceSomAction =
  | {
      type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_REQUESTED';
    }
  | {
      type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_SUCCEED';
      data: DistributionPerformanceSom;
    }
  | {
      type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_FAILED';
      error: Error;
    };
