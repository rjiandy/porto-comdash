// @flow

export type LampHOP = {
  territory: string;
  itemType: string;
  label: string;
  measure: number;
  lastUpdate: number;
  product: string;
};

export type LampHOPData = Array<LampHOP>;

export type LampHOPState = {
  isLoading: boolean;
  error: ?Error;
  data: LampHOPData;
};

export type LampHOPAction =
  | {
      type: 'FETCH_LAMPHOP_REQUESTED';
    }
  | {
      type: 'FETCH_LAMPHOP_SUCCEED';
      data: LampHOPData;
    }
  | {
      type: 'FETCH_LAMPHOP_FAILED';
      error: Error;
    };
