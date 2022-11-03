// @flow

export type Route = {
  path: string;
  SceneComponent: ReactClass<*>;
  needAuth?: boolean;
};
