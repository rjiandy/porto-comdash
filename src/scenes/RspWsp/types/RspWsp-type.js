// @flow
import type {CanvasDistributionPrice} from './CanvasDistributionPrice-type';
import type {Wsp} from './Wsp-type';

export type RspWsp = {
  canvasDistributionPrice: Array<CanvasDistributionPrice>;
  wsp: Array<Wsp>;
};

export type RspWspState = RspWsp & {
  isLoading: boolean;
  error: ?Error;
};

export type RspWspAction =
  | {
      type: 'FETCH_RSP_WSP_REQUESTED';
    }
  | {
      type: 'FETCH_RSP_WSP_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_RSP_WSP_REQUESTED';
    } & RspWsp;
