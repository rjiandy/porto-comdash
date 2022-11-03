// @flow

export type Program = {
  itemType: 'COMMUNITY' | 'PROGRAM' | 'DONUT_HOBBY' | 'DONUT_PROGRAM';
  territory: string;
  label: string;
  measure: number;
  lastUpdate: number;
};

export type Achievement = {
  territory: string;
  product: string;
  lastUpdate: number;
  brandPrimaryCC: number;
  brandSecondaryCC: number;
  CC: number;
  ECC: number;
  packSold: number;
  strikeRate: number;
};

export type Community = {
  programs: Array<Program>;
  achievements: Array<Achievement>;
};

export type CommunityState = {
  data: Community;
  isLoading: boolean;
  error: ?Error;
};
