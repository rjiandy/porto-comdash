// @flow

import {takeEvery, call, put} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* brandProductImageryWatcher(): Generator<*, *, *> {
  yield takeEvery(
    'FETCH_BRAND_PRODUCT_IMAGERY_REQUESTED',
    brandProductImagerySaga,
  );
}

export function* brandProductImagerySaga(): Generator<*, *, *> {
  try {
    let result = yield call(fetchJSON, '/brandProductImageryData', {});
    yield put({
      type: 'FETCH_BRAND_PRODUCT_IMAGERY_SUCCEED',
      data: result.brandProductImagery,
    });
  } catch (error) {
    yield put({type: 'FETCH_BRAND_PRODUCT_IMAGERY_FAILED', error});
  }
}
