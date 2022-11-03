// @flow

import segmentPerformanceWatcher, {
  segmentPerformanceSaga,
} from '../SegmentPerformanceSaga';
import {takeEvery, put, call} from 'redux-saga/effects';
import {fetchStagingAPI as fetchJSON} from '../../../../general/helpers/fetchJSON';

describe('SegmentPerformanceSaga', () => {
  it('Should watch segmentPerformance Request', () => {
    let watcher = segmentPerformanceWatcher();
    expect(watcher.next().value).toEqual(
      takeEvery('FETCH_SEGMENT_PERFORMANCE_REQUESTED', segmentPerformanceSaga),
    );
  });
  it('Should trigger FETCH_JSON and put a success action', () => {
    let saga = segmentPerformanceSaga();
    let data = {
      bubbleChart: [],
      flavorSegment: [],
    };
    expect(saga.next().value).toEqual(
      call(fetchJSON, '/segmentPerformanceData', {}),
    );
    expect(saga.next(data).value).toEqual(
      put({
        type: 'FETCH_SEGMENT_PERFORMANCE_SUCCEED',
        bubbleChart: data.bubbleChart,
        flavorSegment: data.flavorSegment,
      }),
    );
  });
  it('Should throw error and dispatch failed action', () => {
    let saga = segmentPerformanceSaga();
    let err = {a: 1};
    try {
      expect(saga.throw(err)).toEqual(
        put({type: 'FETCH_SEGMENT_PERFORMANCE_FAILED', error: err}),
      );
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
});
