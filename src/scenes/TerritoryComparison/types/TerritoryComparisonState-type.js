// @flow
import type {TerritoryComparison} from './TerritoryComparison-type';

export type TerritoryComparisonState = {
  isLoading: boolean;
  error: ?Error;
} & {territoryComparison: Array<TerritoryComparison>};
