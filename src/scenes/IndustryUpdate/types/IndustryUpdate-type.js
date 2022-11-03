// @flow
import type {FlavorSegment} from './FlavorSegment-type';
import type {IndustrySize} from './IndustrySize-type';
import type {PriceSegment} from './PriceSegment-type';

export type IndustryUpdate = {
  flavorSegmentTrend: Array<FlavorSegment>;
  priceSegmentTrend: Array<PriceSegment>;
  industrySize: Array<IndustrySize>;
};

export type IndustryUpdateState = IndustryUpdate & {
  isLoading: boolean;
  error: ?Error;
};

export type IndustryUpdateAction =
  | {
      type: 'FETCH_INDUSTRY_UPDATE_REQUESTED';
    }
  | ({
      type: 'FETCH_INDUSTRY_UPDATE_SUCCEED';
    } & IndustryUpdate)
  | {
      type: 'FETCH_INDUSTRY_UPDATE_FAILED';
      error: Error;
    };
