### [&laquo; Home](README.md)

# Industry Update

The design spec of **Industry Update** is available on `Commercial Dashboard Design Page 9`. Please refer to the doc to see the visualization.

- [Industry Update](#industry-update)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/industryUpdate`

## Types

```js
// @flow

type IndustryUpdate = {
  flavorSegmentTrend: Array<FlavorSegment>;
  priceSegmentTrend: Array<PriceSegment>;
  industrySize: Array<IndustrySize>;
};

type FlavorSegment = {
  timeMonthID: string;
  monthDesc: string;
  periodType: string;
  territory: string;
  flavorSegment: string;
  som: number;
};

type IndustrySize = {
  timeMonthID: string;
  monthDesc: string;
  periodType: string;
  territory: string;
  volume: number;
  growth: 'NULL' | number;
};

type PriceSegment = {
  timeMonthID: string;
  monthDesc: string;
  periodType: string;
  territory: string;
  priceSegment: string;
  som: number;
};


```
[^ back to top](#industry-update)
