// @flow

import type {Action} from '../../../general/stores/Action';
import type {EventState} from '../types/Event-type';

let initialState = {
  eventAchievements: [],
  isLoading: false,
  error: null,
};

export default function eventReducer(
  state: EventState = initialState,
  action: Action,
) {
  switch (action.type) {
    case 'FETCH_EVENT_ACHIEVEMENT_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_EVENT_ACHIEVEMENT_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_EVENT_ACHIEVEMENT_SUCCEED': {
      let {eventAch} = action;
      return {
        ...state,
        eventAchievements: eventAch,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
