// @flow
import type {TerritoryComparison} from './TerritoryComparison-type';

type TerritoryComparisonPayload = {
  territoryComparison: Array<TerritoryComparison>;
};

export type TerritoryComparisonAction =
  | {
      type: 'FETCH_TERRITORY_COMPARISON_REQUESTED';
    }
  | ({
      type: 'FETCH_TERRITORY_COMPARISON_SUCCEED';
    } & TerritoryComparisonPayload)
  | {
      type: 'FETCH_TERRITORY_COMPARISON_FAILED';
      error: Error;
    };
