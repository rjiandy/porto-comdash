// @flow

export type AdultSmokerProfile = {
  territory: string;
  product: string;
  itemType: | 'DONUT'
    | 'AVG'
    | 'SMOKER_TOTAL'
    | 'SES'
    | 'AGE'
    | 'PUR_PACK'
    | 'PUR_STICK';
  legend: string;
  measure: number;
};

export type AdultSmokerProfileData = Array<AdultSmokerProfile>;

export type AdultSmokerProfileState = {
  adultSmokerProfile: AdultSmokerProfileData;
  isLoading: boolean;
  error: ?Error;
};

export type AdultSmokerProfileAction =
  | {
      type: 'FETCH_ADULT_SMOKER_PROFILE_REQUESTED';
    }
  | {
      type: 'FETCH_ADULT_SMOKER_PROFILE_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_ADULT_SMOKER_PROFILE_SUCCEED';
      smokerProfile: AdultSmokerProfileData;
    };
