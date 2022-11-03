// @flow

import type {Action} from '../../../general/stores/Action';
import type {ConsumerProfileState} from '../types/ConsumerProfile-type';

let initialState = {
  consumerProfile: [],
  isLoading: false,
  error: null,
};

export default function consumerProfileReducer(
  state: ConsumerProfileState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_CONSUMER_PROFILE_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_CONSUMER_PROFILE_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_CONSUMER_PROFILE_SUCCEED': {
      let {consumerProfile} = action;
      return {
        ...state,
        consumerProfile,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
