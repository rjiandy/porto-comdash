// @flow

import type {BrandPerformance} from './BrandPerformance-type';
import type {CompanyPerformance} from './CompanyPerformance-type';
import type {IndustrySizeGainLose} from './IndustrySizeGainLose-type';
import type {TopRightChart} from './TopRightChart-type';

export type MarketUpdate = {
  brandPerformance: Array<BrandPerformance>;
  companyPerformance: Array<CompanyPerformance>;
  industrySizeGainLose: Array<IndustrySizeGainLose>;
  topRightChart: Array<TopRightChart>;
};

export type MarketUpdateState = MarketUpdate & {
  isLoading: boolean;
  error: ?Error;
};

export type MarketUpdateAction =
  | {
      type: 'FETCH_MARKET_UPDATE_REQUESTED';
    }
  | {
      type: 'FETCH_MARKET_UPDATE_SUCCEED';
    } & MarketUpdate
  | {
      type: 'FETCH_MARKET_UPDATE_FAILED';
      error: Error;
    };
