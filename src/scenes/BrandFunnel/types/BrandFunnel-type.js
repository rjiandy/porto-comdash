// @flow
export type BrandFunnel = {
  territory: string;
  product: string;
  smokerProfile: string;
  spontVal: number;
  spontValDelta: ?number;
  trialVal: number;
  trialValDelta: ?number;
  trialValPCT: ?number;
  purchaseVal: number;
  purchaseValDelta: ?number;
  purchaseValPCT: ?number;
  penetrationVal: number;
  penetrationValDelta: ?number;
  penetrationValPCT: ?number;
  mainSmokerVal: number;
  mainSmokerValDelta: ?number;
  mainSmokerValPCT: ?number;
  lastUpdate: number;
  legend: 'string';
};

export type BrandFunnels = Array<BrandFunnel>;

export type BrandFunnelState = {
  data: BrandFunnels;
  isLoading: boolean;
  error: ?Error;
};

export type BrandFunnelAction =
  | {
      type: 'FETCH_BRAND_FUNNEL_REQUESTED';
    }
  | {
      type: 'FETCH_BRAND_FUNNEL_SUCCEED';
      brandFunnel: BrandFunnels;
    }
  | {
      type: 'FETCH_BRAND_FUNNEL_FAILED';
      error: Error;
    };
