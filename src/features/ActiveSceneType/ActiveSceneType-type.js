// @flow

export type ActiveSceneTypeState = 'dashboard' | 'cms';
export type ActiveSceneTypeAction = {
  type: 'ACTIVE_SCENE_TYPE_CHANGED';
  newSceneType: ActiveSceneTypeState;
};
