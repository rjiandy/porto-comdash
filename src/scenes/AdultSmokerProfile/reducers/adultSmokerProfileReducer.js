// @flow

import type {Action} from '../../../general/stores/Action';
import type {AdultSmokerProfileState} from '../types/AdultSmokerProfile-type';

let initialState = {
  adultSmokerProfile: [],
  isLoading: false,
  error: null,
};

export default function adultSmokerProfileReducer(
  state: AdultSmokerProfileState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_ADULT_SMOKER_PROFILE_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_ADULT_SMOKER_PROFILE_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_ADULT_SMOKER_PROFILE_SUCCEED': {
      let {smokerProfile} = action;
      return {
        ...state,
        adultSmokerProfile: smokerProfile,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
