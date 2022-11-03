// @flow

import type {
  ActiveSceneTypeState,
  ActiveSceneTypeAction,
} from './ActiveSceneType-type';

let initialState = 'dashboard';

export default function activeSceneTypeReducer(
  state: ActiveSceneTypeState = initialState,
  action: ActiveSceneTypeAction,
) {
  switch (action.type) {
    case 'ACTIVE_SCENE_TYPE_CHANGED': {
      return action.newSceneType;
    }
    default:
      return state;
  }
}
