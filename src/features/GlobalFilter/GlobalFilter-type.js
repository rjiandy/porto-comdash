// @flow

export type GlobalFilterState = {
  +selectedTerritory: ?string; // NOTE: Using covar here so it can receive string type or null type
  +selectedBrandFamily: ?string;
};

export type GlobalFilterAction =
  | {
      type: 'TERRITORY_SELECTED';
      territory: string;
    }
  | {
      type: 'BRAND_FAMILY_SELECTED';
      brandFamily: string;
    }
  | {
      type: 'GLOBAL_FILTER_CLEARED';
    };
