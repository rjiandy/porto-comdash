// @flow

import {fork} from 'redux-saga/effects';

import currentUserSaga, {
  newsFlashSyncSaga,
} from '../../features/Access/currentUserSaga';
import CMSWatcher from '../../scenes/CMS/CMSSaga';
import landingPageTerritoryManagerWatcher from '../../scenes/LandingPage/sagas/landingPageBrandTerritorySaga';
import marketUpdateWatcher from '../../scenes/MarketUpdate/sagas/marketUpdateSaga';
import industryUpdateWatcher from '../../scenes/IndustryUpdate/sagas/industryUpdateSaga';
import somTrendComparisonWatcher from '../../scenes/SomTrendComparison/sagas/somTrendComparisonSaga';
import imsComparisonWatcher from '../../scenes/IMSComparison/sagas/IMSComparisonSaga';
import distributionPerformanceSomWatcher from '../../scenes/DistributionPerfomanceSom/sagas/distributionPerformanceSomSaga';
import rspWspWatcher from '../../scenes/RspWsp/sagas/rspWspSaga';
import territoryComparisonWatcher from '../../scenes/TerritoryComparison/sagas/territoryComparisonSaga';
import consumerProfileWatcher from '../../scenes/ConsumerProfile/sagas/consumerProfileSaga';
import dstWatcher from '../../scenes/DST/sagas/dstSaga';
import switchingDynamicWatcher from '../../scenes/SwitchingDynamic/sagas/switchingDynamicSaga';
import adultSmokerProfileWatcher from '../../scenes/AdultSmokerProfile/sagas/adultSmokerProfileSaga';
import segmentPerformanceWatcher from '../../scenes/SegmentPerformance/sagas/SegmentPerformanceSaga';
import brandProductImageryWatcher from '../../scenes/BrandProductImagery/sagas/brandProductImagerySaga';
import communityWathcer from '../../scenes/Community/saga/communitySaga';
import lampHOPWatcher from '../../scenes/LampHOP/sagas/lampHOPSaga';
import brandFunnelWatcher from '../../scenes/BrandFunnel/sagas/brandFunnelSaga';
import oohSagaWatcher from '../../scenes/OOH/sagas/oohWidgetSaga';
import eventWatcher from '../../scenes/Event/sagas/eventSaga';
import channelSummarySaga from '../../scenes/ChannelSummary/sagas/channelSummarySaga';

export default function* rootSaga(): Generator<*, *, *> {
  // yield takeEvery('*', (action) => console.log(action)); // eslint-disable-line
  yield fork(currentUserSaga);
  yield fork(CMSWatcher);
  yield fork(newsFlashSyncSaga);
  yield fork(landingPageTerritoryManagerWatcher);
  yield fork(marketUpdateWatcher);
  yield fork(industryUpdateWatcher);
  yield fork(somTrendComparisonWatcher);
  yield fork(imsComparisonWatcher);
  yield fork(distributionPerformanceSomWatcher);
  yield fork(rspWspWatcher);
  yield fork(territoryComparisonWatcher);
  yield fork(consumerProfileWatcher);
  yield fork(dstWatcher);
  yield fork(switchingDynamicWatcher);
  yield fork(adultSmokerProfileWatcher);
  yield fork(segmentPerformanceWatcher);
  yield fork(brandProductImageryWatcher);
  yield fork(communityWathcer);
  yield fork(lampHOPWatcher);
  yield fork(brandFunnelWatcher);
  yield fork(oohSagaWatcher);
  yield fork(eventWatcher);
  yield fork(channelSummarySaga);
  // -> '*' a wildcard that reads every action. Will change this later based on usage
}
