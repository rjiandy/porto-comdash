// @flow
import LandingPageScene from '../scenes/LandingPage/LandingPageScene';
import IndustryUpdateScene from '../scenes/IndustryUpdate/IndustryUpdateScene';
import MarketUpdateScene from '../scenes/MarketUpdate/MarketUpdateScene';
import SomTrendComparisonScene from '../scenes/SomTrendComparison/SomTrendComparisonScene';
import DistributionPerformanceSOMScene from '../scenes/DistributionPerfomanceSom/DistributionPerformanceSOMScene';
import SalesPerformanceScene from '../scenes/IMSComparison/SalesPerformanceScene';
import ImsComparisonScene from '../scenes/IMSComparison/IMSComparisonScene';
import RspWspScene from '../scenes/RspWsp/RspWspScene';
import TerritoryComparisonScene from '../scenes/TerritoryComparison/TerritoryComparisonScene';

import DSTScene from '../scenes/DST/DSTScene';
import ConsumerProfileScene from '../scenes/ConsumerProfile/ConsumerProfileScene';
import AdultSmokerProfileScene from '../scenes/AdultSmokerProfile/AdultSmokerProfileScene';
import SegmentPerformanceScene from '../scenes/SegmentPerformance/SegmentPerformanceScene';
import BrandFunnelScene from '../scenes/BrandFunnel/BrandFunnelScene';
import BrandProductImageryScene from '../scenes/BrandProductImagery/BrandProductImageryScene';
import SwitchingDynamicScene from '../scenes/SwitchingDynamic/SwitchingDynamicScene';
import EventScene from '../scenes/Event/EventScene';
import ChannelSummaryScene from '../scenes/ChannelSummary/ChannelSummaryScene';
import LampHOPScene from '../scenes/LampHOP/LampHOPScene';
import TradeInvestmentScene from '../scenes/TradeInvestment/TradeInvestmentScene';
import OOHScene from '../scenes/OOH/OOHScene';

// import tnDefault from '../assets/images/widgets/default.svg';

import tnAdultSmokerProfile from '../assets/images/widgets/adult-smoker-profile.svg';
import tnBrandFunnel from '../assets/images/widgets/brand-funnel.png';
import tnConsumerProfile from '../assets/images/widgets/consumer-profile.png';
import tnBrandProductImagery from '../assets/images/widgets/brand-product-imagery.png';
import tnDistributionPerformanceSom from '../assets/images/widgets/distribution-performance.png';
import tnDst from '../assets/images/widgets/dst.png';
import tnImsComparison from '../assets/images/widgets/ims-comparison.png';
import tnIndustryUpdate from '../assets/images/widgets/industry-update.png';
import tnLampHop from '../assets/images/widgets/lamp-hop.png';
import tnLandingPage from '../assets/images/widgets/landing-page-territory.png';
import tnMarketUpdate from '../assets/images/widgets/market-update.png';
import tnOOH from '../assets/images/widgets/ooh.png';
import tnRspWsp from '../assets/images/widgets/rsp-wsp.png';
import tnSalesPerformance from '../assets/images/widgets/sales-performance.svg';
import tnSegmentPerformance from '../assets/images/widgets/segment-performance.png';
import tnTerritoryComparison from '../assets/images/widgets/territory-comparison.png';
import tnSomTrendComparison from '../assets/images/widgets/som-trend-comparison.png';
import tnSwitchingDynamic from '../assets/images/widgets/switching-dynamic.png';
// import tnTerritoryComparison from '../assets/images/widgets/territory-comparison.png';

export type WidgetDefinition = {
  key: string;
  title: string;
  thumbnail: string;
  Component: ReactClass<*>;
  otherProps?: {[key: string]: mixed};
};

export const widgets = {
  landingPage: {
    title: 'Daily Volume Update',
    thumbnail: tnLandingPage,
    Component: LandingPageScene,
  },
  // landingPageBrand: {
  //   title: 'Daily Volume Update by Brand',
  //   thumbnail: tnLandingPage,
  //   Component: LandingPageScene,
  // },
  // landingPageChannel: {
  //   title: 'Channel Investment Summary',
  //   thumbnail: tnLandingPage,
  //   Component: LandingPageScene,
  // },
  tradeInvestment: {
    title: 'Trade Investment',
    thumbnail: 'default',
    Component: TradeInvestmentScene,
  },
  marketUpdate: {
    title: 'Market Update',
    thumbnail: tnMarketUpdate,
    Component: MarketUpdateScene,
  },
  industryUpdate: {
    title: 'Industry Update',
    thumbnail: tnIndustryUpdate,
    Component: IndustryUpdateScene,
  },
  somTrendComparisonBrand: {
    title: 'SOM Trends',
    thumbnail: tnSomTrendComparison,
    Component: SomTrendComparisonScene,
  },
  distributionPerformanceSOM: {
    title: 'Distribution, Price & SOM Trends',
    thumbnail: tnDistributionPerformanceSom,
    Component: DistributionPerformanceSOMScene,
  },
  salesPerformance: {
    title: 'Sales Performance',
    thumbnail: tnSalesPerformance,
    Component: SalesPerformanceScene,
  },
  imsComparison: {
    title: 'IMS Comparison',
    thumbnail: tnImsComparison,
    Component: ImsComparisonScene,
  },
  rspWspTerritory: {
    title: 'RSP & WSP (Territory Comparison)',
    thumbnail: tnRspWsp,
    Component: RspWspScene,
  },
  territoryComparison: {
    title: 'Territory Performance Comparison',
    thumbnail: tnTerritoryComparison,
    Component: TerritoryComparisonScene,
  },
  rspWspBrand: {
    title: 'RSP & WSP (SKU Comparison)',
    thumbnail: tnRspWsp,
    Component: RspWspScene,
  },
  dst: {
    title: 'DST',
    thumbnail: tnDst,
    Component: DSTScene,
  },
  consumerProfile: {
    title: 'Consumer Profile',
    thumbnail: tnConsumerProfile,
    Component: ConsumerProfileScene,
  },
  smokerProfile: {
    title: 'Adult Smoker Profile',
    thumbnail: tnAdultSmokerProfile,
    Component: AdultSmokerProfileScene,
  },
  segmentPerformance: {
    title: 'Segment Performance',
    thumbnail: tnSegmentPerformance,
    Component: SegmentPerformanceScene,
  },
  brandProductImagery: {
    title: 'Brand Product Imagery',
    thumbnail: tnBrandProductImagery,
    Component: BrandProductImageryScene,
  },
  switchingDynamic: {
    title: 'Switching Dynamic',
    thumbnail: tnSwitchingDynamic,
    Component: SwitchingDynamicScene,
  },
  event: {
    title: 'Event',
    Component: EventScene,
  },
  channelSummary: {
    title: 'Channel Summary',
    Component: ChannelSummaryScene,
  },
  lampHop: {
    title: 'Lamp HOP',
    thumbnail: tnLampHop,
    Component: LampHOPScene,
  },
  brandFunnel: {
    title: 'Brand Funnel',
    thumbnail: tnBrandFunnel,
    Component: BrandFunnelScene,
  },
  ooh: {
    title: 'OOH',
    thumbnail: tnOOH,
    Component: OOHScene,
  },
};

// Here we flatten the object above into an array. The reason we use an object
// in the first place is to help reduce the chance of a duplicate key.
const widgetList: Array<WidgetDefinition> = Object.keys(widgets).map((key) => {
  return {
    key,
    ...widgets[key],
  };
});

export default widgetList;

// TODO change this library from backend
const widgetLibrary = {};

// Here we flatten the object above into an array. The reason we use an object
// in the first place is to help reduce the chance of a duplicate key.
export const widgetLibraryList = Object.keys(widgetLibrary).map((key) => {
  return {
    key,
    ...widgetLibrary[key],
  };
});
