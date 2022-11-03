// @flow

export type Viewport = {
  height: number;
  width: number;
};

export type ViewportListenerAction = {
  type: 'VIEWPORT_UPDATED';
  windowSize: Viewport;
};
