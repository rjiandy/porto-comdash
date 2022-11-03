### [&laquo; Home](README.md)

# Market Update

The design spec of **Market Update** widget is available on `Commercial Dashboard Design Page 4 - 5`. Please refer to the doc to see the visualization.

- [Market Update](#market-update)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/marketUpdate`

## Types

```js
// @flow

// The market update data from '/marketUpdate' end point as follows
type MarketUpdate = {
  brandPerformance: Array<BrandPerformance>;
  companyPerformance: Array<CompanyPerformance>;
  industrySizeGainLose: Array<IndustrySizeGainLose>;
  TopRightChart: Array<TopRightChart>;
};

type BrandPerformance = {
  monthID: string;
  monthDesc: string;
  territory: string;
  brandFamily: string;
  product: string;
  som: number;
};

type CompanyPerformance = {
  territory: string;
  company: string;
  som: number;
  somGrowth: number;
};

type IndustrySizeGainLose = {
  territory: string;
  ytdBrand: string;
  ytdBrandSom: number;
  ytdBrandGainer: number;
  ytdBrandGainerSom: number;
  ytdBrandLoser: number;
  ytdBrandLoserSom: number;
  ytdOrder: number;
};

type TopRightChart = {
  territory: string;
  brandFamily: string;
  product: string;
  somYtd: number;
  somGrowth: number;
  somLastMonth: number;
  somLastTwoMonth: number;
  somThisMonth: number;
};





```
[^ back to top](#market-update)
