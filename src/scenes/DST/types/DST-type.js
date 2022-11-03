// @flow
import type {ConsumerBrand} from './ConsumerBrand-type';
import type {KPIAchievement} from './KPIAchievement-type';

export type DST = {
  consumerBrand: Array<ConsumerBrand>;
  kpiAchievement: Array<KPIAchievement>;
};

export type DSTState = {
  data: DST;
  isLoading: boolean;
  error: ?Error;
};

export type DSTAction =
  | {
      type: 'FETCH_DST_REQUESTED';
    }
  | {
      type: 'FETCH_DST_SUCCEED';
      data: DST;
    }
  | {
      type: 'FETCH_DST_FAILED';
      error: Error;
    };
