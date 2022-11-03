// @flow

import type {GlobalFilterState} from './GlobalFilter-type';
import type {Action} from '../../general/stores/Action';

let initialState = {
  selectedTerritory: null,
  selectedBrandFamily: null,
};

export default function globalFilterReducer(
  state: GlobalFilterState = initialState,
  action: Action,
): GlobalFilterState {
  switch (action.type) {
    case 'TERRITORY_SELECTED': {
      return {
        ...state,
        selectedTerritory: action.territory,
      };
    }
    case 'BRAND_FAMILY_SELECTED': {
      return {
        ...state,
        selectedBrandFamily: action.brandFamily,
      };
    }
    // case 'GLOBAL_FILTER_CLEARED': { //TODO delete this after their team is sure not to use this
    //   return initialState;
    // }
    case 'AUTHORIZATION_SUCCEED': {
      let {userData} = action;
      let selectedTerritory;
      let selectedBrandFamily;
      if (userData.territories.length > 0) {
        selectedTerritory = userData.territories[0].territory;
      }
      if (userData.brandFamily.length > 0) {
        selectedBrandFamily = userData.brandFamily[0].brandFamily;
      }
      return {
        selectedTerritory: state.selectedTerritory || selectedTerritory,
        selectedBrandFamily: state.selectedBrandFamily || selectedBrandFamily,
      };
    }
    default:
      return state;
  }
}
