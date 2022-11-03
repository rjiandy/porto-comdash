// @flow

import type {SegmentPerformanceState} from '../types/SegmentPerformance-type';
import type {Action} from '../../../general/stores/Action';

let initialState: SegmentPerformanceState = {
  bubbleChart: [],
  volumeGrowth: [],
  flavorSegment: [],
  error: null,
  isLoading: true,
};

export default function segmentPerformanceReducer(
  state: SegmentPerformanceState = initialState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_SEGMENT_PERFORMANCE_REQUESTED': {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case 'FETCH_SEGMENT_PERFORMANCE_SUCCEED': {
      return {
        bubbleChart: action.bubbleChart,
        flavorSegment: action.flavorSegment,
        volumeGrowth: action.volumeGrowth,
        error: null,
        isLoading: false,
      };
    }
    case 'FETCH_SEGMENT_PERFORMANCE_FAILED': {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
