// @flow

export type SwitchingDynamic = {
  territory: string;
  product: string;
  smokerProfile: string;
  brand: string;
  switchOutValue: number;
  switchNet: number;
  switchInValue: number;
};

export type SwitchingDynamics = Array<SwitchingDynamic>;

export type SwitchingDynamicState = {
  switchingDynamic: SwitchingDynamics;
  isLoading: boolean;
  error: ?Error;
};

export type SwitchingDynamicAction =
  | {
      type: 'FETCH_SWITCHING_DYNAMIC_REQUESTED';
    }
  | {
      type: 'FETCH_SWITCHING_DYNAMIC_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_SWITCHING_DYNAMIC_SUCCEED';
      switchingDynamic: SwitchingDynamics;
    };
