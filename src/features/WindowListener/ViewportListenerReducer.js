// @flow

import type {Viewport} from './Viewport';
import type {Action} from '../../general/stores/Action';

const initialState = {
  width: window.innerWidth, // eslint-disable-line
  height: window.innerHeight, // eslint-disable-line
};

export default function viewportListenerReducer(state: Viewport = initialState, action: Action) {
  switch (action.type) {
    case 'VIEWPORT_UPDATED': {
      let {windowSize} = action;
      return {
        width: windowSize.width,
        height: windowSize.height,
      };
    }
    default: return state;
  }
}
