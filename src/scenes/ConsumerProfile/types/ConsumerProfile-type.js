// @flow

export type ConsumerProfileDatum = {
  territory: string;
  product: string;
  itemType: 'AGE' | 'SES';
  legend: string;
  measure: number;
};

export type ConsumerProfile = Array<ConsumerProfileDatum>;

export type ConsumerProfileState = {
  consumerProfile: ConsumerProfile;
  isLoading: boolean;
  error: ?Error;
};

export type ConsumerProfileAction =
  | {
      type: 'FETCH_CONSUMER_PROFILE_REQUESTED';
    }
  | {
      type: 'FETCH_CONSUMER_PROFILE_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_CONSUMER_PROFILE_SUCCEED';
      consumerProfile: ConsumerProfile;
    };
