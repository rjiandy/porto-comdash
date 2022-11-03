// @flow

export type Event = {
  itemType: 'EVENT_DAYS' | 'AUDIENCES' | 'PIE_EVENT' | 'TABLE_AUDIENCE';
  territory: string;
  brandFamily: ?string;
  product: string;
  label: string;
  measure: ?number;
  audience: ?number;
  cc: ?number;
  ecc: ?number;
  participant: ?number;
  lastUpdate: number;
};

export type EventState = {
  eventAchievements: Array<Event>;
  isLoading: boolean;
  error: ?Error;
};

export type EventAction =
  | {
      type: 'FETCH_EVENT_ACHIEVEMENT_REQUESTED';
    }
  | {
      type: 'FETCH_EVENT_ACHIEVEMENT_SUCCEED';
      eventAch: Array<Event>;
    }
  | {
      type: 'FETCH_EVENT_ACHIEVEMENT_FAILED';
      error: Error;
    };
