// @flow

import type {Viewport} from '../../features/WindowListener/Viewport';
import type {UserState} from '../../features/Access/CurrentUser-type';
import type {GlobalFilterState} from '../../features/GlobalFilter/GlobalFilter-type';
import type {WidgetListState} from '../../features/WidgetList/WidgetList-type';
import type {ActiveSceneTypeState} from '../../features/ActiveSceneType/ActiveSceneType-type';
import type {CMSState} from '../../scenes/CMS/CMS-type';

import type {BrandTerritoryState} from '../../scenes/LandingPage/LandingPage-types';
import type {MarketUpdateState} from '../../scenes/MarketUpdate/types/MarketUpdate-type';
import type {IndustryUpdateState} from '../../scenes/IndustryUpdate/types/IndustryUpdate-type';
import type {SomTrendComparisonState} from '../../scenes/SomTrendComparison/types/SomTrendComparison-type';
import type {IMSComparisonState} from '../../scenes/IMSComparison/types/IMSComparison-type';
import type {DistributionPerformanceSomState} from '../../scenes/DistributionPerfomanceSom/types/DistributionPerformanceSom-type';
import type {RspWspState} from '../../scenes/RspWsp/types/RspWsp-type';
import type {TerritoryComparisonState} from '../../scenes/TerritoryComparison/types/TerritoryComparisonState-type';
import type {ConsumerProfileState} from '../../scenes/ConsumerProfile/types/ConsumerProfile-type';
import type {DSTState} from '../../scenes/DST/types/DST-type';
import type {SegmentPerformanceState} from '../../scenes/SegmentPerformance/types/SegmentPerformance-type';
import type {SwitchingDynamicState} from '../../scenes/SwitchingDynamic/types/SwitchingDynamic-type';
import type {AdultSmokerProfileState} from '../../scenes/AdultSmokerProfile/types/AdultSmokerProfile-type';
import type {BrandProductImageryState} from '../../scenes/BrandProductImagery/types/BrandProductImagery-type';
import type {CommunityState} from '../../scenes/Community/types/Community-type';
import type {LampHOPState} from '../../scenes/LampHOP/types/lampHOP-type';
import type {BrandFunnelState} from '../../scenes/BrandFunnel/types/BrandFunnel-type';
import type {OOHState} from '../../scenes/OOH/type/OOH-type';
import type {EventState} from '../../scenes/Event/types/Event-type';
import type {ChannelSummaryState} from '../../scenes/ChannelSummary/types/ChannelSummary-type';

export type RootState = {
  windowSize: Viewport;
  currentUser: UserState;
  globalFilter: GlobalFilterState;
  widgetList: WidgetListState;
  activeSceneType: ActiveSceneTypeState;
  cmsState: CMSState;

  landingPageBrandTerritoryState: BrandTerritoryState;
  marketUpdateState: MarketUpdateState;
  industryUpdateState: IndustryUpdateState;
  somTrendComparisonState: SomTrendComparisonState;
  imsComparisonState: IMSComparisonState;
  distributionPerformanceSomState: DistributionPerformanceSomState;
  rspWspState: RspWspState;
  territoryComparisonState: TerritoryComparisonState;
  consumerProfileState: ConsumerProfileState;
  dstState: DSTState;
  switchingDynamicState: SwitchingDynamicState;
  adultSmokerProfileState: AdultSmokerProfileState;
  segmentPerformanceState: SegmentPerformanceState;
  brandProductImageryState: BrandProductImageryState;
  communityState: CommunityState;
  lampHOPState: LampHOPState;
  brandFunnelState: BrandFunnelState;
  oohState: OOHState;
  eventState: EventState;
  channelSummaryState: ChannelSummaryState;
};
