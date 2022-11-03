### [&laquo; Home](README.md)

# RSP WSP

The design spec of **Industry Update** is available on `Commercial Dashboard Design Page 9`. Please refer to the doc to see the visualization.

- [RSP WSP](#rsp-wsp)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/rspWsp`

## Types

```ts
/* flow */

type RspWsp = {
  canvasDistributionPrice: Array<CanvasDistributionPrice>;
  wsp: Array<Wsp>;
};

type CanvasDistributionPrice = {
  timeweekID: string;
  monthID: string;
  monthDesc: string;
  territory: string;
  survey: 'Pack Selling Price' | 'Stick Selling Price';
  brandFamily: string;
  brand: string;
  brandSKU: string;
  distPrice: number;
  price: number;
  pricePCT: number;
  areaSource: string;
};

type Wsp = {
  timeweekID: string;
  territory: string;
  brandFamily: string;
  brand: string;
  brandSKU: string;
  distPriceWSP: number;
  canvasPrice: number;
  wspPrice: number;
  rspPackPrice: number;
  rspStickPrice: number;
  wspMinPrice: number;
  wspMaxPrice: number;
  wspAveragePrice: number;
  wspPriceTwo: number;
  wspPCTPrice: number;
  wspPCTPriceTwo: number;
};

```
[^ back to top](#rsp-wsp)
