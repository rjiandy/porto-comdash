### [&laquo; Home](README.md)

# Brand Funnel

The design spec of **Brand Funnel** is available on `Commercial Dashboard Design Page 20`. Please refer to the doc to see the visualization.

- [Brand Funnel](#brand-funnel)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/brandFunnel`

## Types

```ts
type BrandFunnel = {
  territory: string;
  product: string;
  smokerProfile: string;
  spontVal: number;
  spontValDelta: 'NULL' | number;
  trialVal: number;
  trialValDelta: 'NULL' | number;
  trialValPCT: number;
  purchaseVal: number;
  purchaseValDelta: 'NULL' | number;
  purchaseValPCT: number;
  penetrationVal: number;
  penetrationValDelta: 'NULL' | number;
  penetrationValPCT: number;
  mainSmokerVal: number;
  mainSmokerValDelta: 'NULL' | number;
  mainSmokerValPCT: string;
  lastUpdate: number;
  legend: 'string';
};

type BrandFunnels = Array<BrandFunnel>;

```
[^ back to top](#brand-funnel)
