// @flow

export type OOH = {
  territory: string;
  billboard: number;
  baliho: number;
  minibillboard: number;
  streetsignage: number;
  others: number;
};

export type OOHDetail = {
  territory: string;
  oohType: string;
  itemType: 'SITE' | 'VISUAL';
  label: string;
  measure: number;
};

export type OOHData = Array<OOH>;
export type OOHDetailData = Array<OOHDetail>;

export type OOHState = {
  data: {
    ooh: OOHData;
    oohDetail: OOHDetailData;
  };
  isLoading: boolean;
  error: ?Error;
};

export type OOHAction =
  | {
      type: 'FETCH_OOH_REQUESTED';
    }
  | {
      type: 'FETCH_OOH_SUCCEED';
      data: {
        ooh: OOHData;
        oohDetail: OOHDetailData;
      };
    }
  | {
      type: 'FETCH_OOH_FAILED';
      error: Error;
    };
