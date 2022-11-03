// @flow

import type {Action} from '../../../general/stores/Action';
import type {ChannelSummaryState} from '../types/ChannelSummary-type';

let initialState = {
  channelSummaryData: [],
  isLoading: false,
  error: null,
};

export default function channelSummaryReducer(
  state: ChannelSummaryState = initialState,
  action: Action,
) {
  switch (action.type) {
    case 'FETCH_CHANNEL_SUMMARY_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_CHANNEL_SUMMARY_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    case 'FETCH_CHANNEL_SUMMARY_SUCCEED': {
      let {channelSummary} = action;
      return {
        ...state,
        channelSummaryData: channelSummary,
        isLoading: false,
        error: null,
      };
    }
    default:
      return state;
  }
}
