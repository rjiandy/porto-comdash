// @flow

import {combineReducers} from 'redux';

import viewportListener from '../../features/WindowListener/ViewportListenerReducer';
import currentUserReducer from '../../features/Access/currentUserReducer';
import globalFilterReducer from '../../features/GlobalFilter/globalFilterReducer';
import widgetListReducer from '../../features/WidgetList/widgetListReducer';
import activeSceneTypeReducer from '../../features/ActiveSceneType/activeSceneTypeReducer';
import cmsReducer from '../../scenes/CMS/CMSReducer';

import brandTerritoryReducer from '../../scenes/LandingPage/reducers/landingPageBrandTerritoryReducer';
import marketUpdateReducer from '../../scenes/MarketUpdate/reducers/marketUpdateReducer';
import industryUpdateReducer from '../../scenes/IndustryUpdate/reducers/industryUpdateReducer';
import somTrendComparisonReducer from '../../scenes/SomTrendComparison/reducers/somTrendComparisonReducer';
import imsComparisonReducer from '../../scenes/IMSComparison/reducers/IMSComparisonReducer';
import distributionPerformanceSomReducer from '../../scenes/DistributionPerfomanceSom/reducers/distributionPerformanceSomReducer';
import rspWspReducer from '../../scenes/RspWsp/reducers/rspWspReducer';
import territoryComparisonReducer from '../../scenes/TerritoryComparison/reducers/territoryComparisonReducer';
import consumerProfileReducer from '../../scenes/ConsumerProfile/reducers/consumerProfileReducer';
import dstReducer from '../../scenes/DST/reducers/dstReducer';
import switchingDynamicReducer from '../../scenes/SwitchingDynamic/reducers/switchingDynamicReducer';
import adultSmokerProfileReducer from '../../scenes/AdultSmokerProfile/reducers/adultSmokerProfileReducer';
import segmentPerformanceReducer from '../../scenes/SegmentPerformance/reducers/SegmentPerformanceReducer';
import brandProductImageryReducer from '../../scenes/BrandProductImagery/reducers/brandProductImageryReducer';
import communityReducer from '../../scenes/Community/reducers/communityReducer';
import lampHOPReducer from '../../scenes/LampHOP/reducers/lampHOPReducer';
import brandFunnelReducer from '../../scenes/BrandFunnel/reducers/brandFunnelReducer';
import oohWidgetReducer from '../../scenes/OOH/reducers/oohWidgetReducer';
import eventReducer from '../../scenes/Event/reducers/eventReducer';
import channelSummaryReducer from '../../scenes/ChannelSummary/reducers/channelSummaryReducer';

export default combineReducers({
  windowSize: viewportListener,
  currentUser: currentUserReducer,
  globalFilter: globalFilterReducer,
  widgetList: widgetListReducer,
  activeSceneType: activeSceneTypeReducer,
  cmsState: cmsReducer,

  landingPageBrandTerritoryState: brandTerritoryReducer,
  marketUpdateState: marketUpdateReducer,
  industryUpdateState: industryUpdateReducer,
  somTrendComparisonState: somTrendComparisonReducer,
  imsComparisonState: imsComparisonReducer,
  distributionPerformanceSomState: distributionPerformanceSomReducer,
  rspWspState: rspWspReducer,
  territoryComparisonState: territoryComparisonReducer,
  consumerProfileState: consumerProfileReducer,
  dstState: dstReducer,
  switchingDynamicState: switchingDynamicReducer,
  adultSmokerProfileState: adultSmokerProfileReducer,
  segmentPerformanceState: segmentPerformanceReducer,
  brandProductImageryState: brandProductImageryReducer,
  communityState: communityReducer,
  lampHOPState: lampHOPReducer,
  brandFunnelState: brandFunnelReducer,
  oohState: oohWidgetReducer,
  eventState: eventReducer,
  channelSummaryState: channelSummaryReducer,
});
