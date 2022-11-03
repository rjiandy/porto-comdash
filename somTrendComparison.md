### [&laquo; Home](README.md)

# SOM Trend Comparison

The design spec of **SOM Trend Comparison** widget is available on `Commercial Dashboard Design Page 13`. Please refer to the doc to see the visualization.

- [SOM Trend Comparison](#som-trend-comparison)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/somTrendComparison`

## Types

```js
// @flow

type SomTrendComparison = {
  somTrendComparison: Array<SomTrendComparisonData>;
};

type SomTrendComparisonData = {
  monthID: string;
  territory: string;
  brandFamily: 'NULL' | string;
  category: 'BRAND' | 'BRAND_FAMILY' | 'BRAND_SKU' | 'BRAND_VARIANT';
  product: string;
  som: number;
  somPP: number;
  somGrowth: number;
  lastUpdate: string;
};


```
[^ back to top](#som-trend-comparison)
