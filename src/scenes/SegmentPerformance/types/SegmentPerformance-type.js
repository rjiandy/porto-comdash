// @flow

export type SegmentPerformance = {
  monthID: number;
  territory: string;
  company: string;
  flavor: 'SKT' | 'SKM High TAR' | 'SKM Low TAR' | 'White';
  subTypec: 'Low' | 'Medium' | 'Premium' | 'Super Low';
  somTY: number;
  somLY: number | 'NULL';
  somPCT: number;
  sortOrderCompany: number;
  sortOrderTerritory: number;
};

export type BubbleChart = SegmentPerformance & {
  brand: string;
};

export type BubbleChartDataProps = {
  _id: string;
  value: number;
  selected: boolean;
  somTY: number;
  displayText: string;
  colorValue: number;
};

export type VolumeGrowth = {
  monthID: number;
  territory: string;
  company: string;
  volume: number;
  growth: number;
  som: number;
  growthSOM: number;
  LastUpdate: number;
};

export type SegmentPerformanceState = {
  flavorSegment: Array<SegmentPerformance>;
  bubbleChart: Array<BubbleChart>;
  volumeGrowth: Array<VolumeGrowth>;
  isLoading: boolean;
  error: ?Error;
};

export type SegmentPerformanceAction =
  | {
      type: 'FETCH_SEGMENT_PERFORMANCE_FAILED';
      error: Error;
    }
  | {
      type: 'FETCH_SEGMENT_PERFORMANCE_SUCCEED';
      flavorSegment: Array<SegmentPerformance>;
      bubbleChart: Array<BubbleChart>;
      volumeGrowth: Array<VolumeGrowth>;
    }
  | {
      type: 'FETCH_SEGMENT_PERFORMANCE_REQUESTED';
    };
