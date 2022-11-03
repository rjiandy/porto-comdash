// @flow

export type ChannelSummary = {
  itemType: string;
  territory: string;
  brandFamily: string;
  label: string;
  measure: number;
  lastUpdate: number;
};

export type ChannelSummaryState = {
  channelSummaryData: Array<ChannelSummary>;
  isLoading: boolean;
  error: ?Error;
};

export type ChannelSummaryAction =
  | {
      type: 'FETCH_CHANNEL_SUMMARY_REQUESTED';
    }
  | {
      type: 'FETCH_CHANNEL_SUMMARY_SUCCEED';
      channelSummary: Array<ChannelSummary>;
    }
  | {
      type: 'FETCH_CHANNEL_SUMMARY_FAILED';
      error: ?Error;
    };
