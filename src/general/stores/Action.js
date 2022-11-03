// @flow

import type {ViewportListenerAction} from '../../features/WindowListener/Viewport';
import type {UserAccessAction} from '../../features/Access/CurrentUser-type';
import type {GlobalFilterAction} from '../../features/GlobalFilter/GlobalFilter-type';
import type {WidgetListAction} from '../../features/WidgetList/WidgetList-type';
import type {CMSAction} from '../../scenes/CMS/CMS-type';
import type {ActiveSceneTypeAction} from '../../features/ActiveSceneType/ActiveSceneType-type';

import type {LandingPageBrandTerritoryAction} from '../../scenes/LandingPage/LandingPage-types';
import type {MarketUpdateAction} from '../../scenes/MarketUpdate/types/MarketUpdate-type';
import type {IndustryUpdateAction} from '../../scenes/IndustryUpdate/types/IndustryUpdate-type';
import type {SomTrendComparisonAction} from '../../scenes/SomTrendComparison/types/SomTrendComparison-type';
import type {IMSComparisonAction} from '../../scenes/IMSComparison/types/IMSComparison-type';
import type {RspWspAction} from '../../scenes/RspWsp/types/RspWsp-type';
import type {DistributionPerformanceSomAction} from '../../scenes/DistributionPerfomanceSom/types/DistributionPerformanceSom-type';
import type {TerritoryComparisonAction} from '../../scenes/TerritoryComparison/types/TerritoryComparisonAction-type';
import type {ConsumerProfileAction} from '../../scenes/ConsumerProfile/types/ConsumerProfile-type';
import type {SwitchingDynamicAction} from '../../scenes/SwitchingDynamic/types/SwitchingDynamic-type';
import type {DSTAction} from '../../scenes/DST/types/DST-type';
import type {AdultSmokerProfileAction} from '../../scenes/AdultSmokerProfile/types/AdultSmokerProfile-type';
import type {SegmentPerformanceAction} from '../../scenes/SegmentPerformance/types/SegmentPerformance-type';
import type {BrandProductImageryAction} from '../../scenes/BrandProductImagery/types/BrandProductImagery-type';
import type {CommunityAction} from '../../scenes/Community/types/Community-ActionType';
import type {LampHOPAction} from '../../scenes/LampHOP/types/lampHOP-type';
import type {BrandFunnelAction} from '../../scenes/BrandFunnel/types/BrandFunnel-type';
import type {OOHAction} from '../../scenes/OOH/type/OOH-type';
import type {EventAction} from '../../scenes/Event/types/Event-type';
import type {ChannelSummaryAction} from '../../scenes/ChannelSummary/types/ChannelSummary-type';

export type Action =
  | CMSAction
  | GlobalFilterAction
  | UserAccessAction
  | ViewportListenerAction
  | WidgetListAction
  | ActiveSceneTypeAction
  | LandingPageBrandTerritoryAction
  | MarketUpdateAction
  | IndustryUpdateAction
  | SomTrendComparisonAction
  | IMSComparisonAction
  | RspWspAction
  | ConsumerProfileAction
  | DistributionPerformanceSomAction
  | TerritoryComparisonAction
  | SwitchingDynamicAction
  | DSTAction
  | AdultSmokerProfileAction
  | BrandProductImageryAction
  | BrandFunnelAction
  | SegmentPerformanceAction
  | CommunityAction
  | LampHOPAction
  | OOHAction
  | EventAction
  | ChannelSummaryAction;
export type Dispatch = Action => void;
