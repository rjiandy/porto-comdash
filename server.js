let landingPageTerritoryBrandData = require('./fixtures/landingPageTerritoryBrandData.json');
let marketUpdateData = require('./fixtures/marketUpdateData.json');
let industryUpdateData = require('./fixtures/industryUpdateData.json');
let somTrendComparisonData = require('./fixtures/somTrendComparisonData.json');
let distributionPerformanceSomData = require('./fixtures/distributionPerformanceSomData.json');
let imsComparisonData = require('./fixtures/imsComparisonData.json');
let dstData = require('./fixtures/dstData.json');
let rspWspData = require('./fixtures/rspWspData.json');
let consumerProfileData = require('./fixtures/consumerProfileData.json');
let segmentPerformanceData = require('./fixtures/segmentPerformanceData.json');
let territoryComparisonData = require('./fixtures/territoryComparisonData.json');
let smokerProfileData = require('./fixtures/smokerProfileData.json');
let switchingDynamicData = require('./fixtures/switchingDynamicData.json');
let communityData = require('./fixtures/community.json');
let brandProductImageryData = require('./fixtures/brandProductImagery.json');
let brandFunnelData = require('./fixtures/brandFunnel.json');
let lampHOPData = require('./fixtures/lampHOPData.json');
let oohData = require('./fixtures/oohData.json');

module.exports = () => {
  const data = {
    landingPageTerritoryBrandData,
    marketUpdateData,
    industryUpdateData,
    somTrendComparisonData,
    distributionPerformanceSomData,
    imsComparisonData,
    dstData,
    rspWspData,
    consumerProfileData,
    segmentPerformanceData,
    territoryComparisonData,
    smokerProfileData,
    switchingDynamicData,
    communityData,
    brandProductImageryData,
    brandFunnelData,
    lampHOPData,
    oohData,
  };
  return data;
};
