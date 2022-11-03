### [&laquo; Home](README.md)

# Consumer Profile

The design spec of **Consumer Profile** is available on `Commercial Dashboard Design Page 21`. Please refer to the doc to see the visualization.

- [Consumer Profile](#consumer-profile)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/consumerProfile`

## Types

```ts
/* flow */

export type ConsumerProfileDatum = {
  territory: string;
  product: string;
  itemType: 'AGE' | 'SES';
  legend: string;
  measure: number;
};

export type ConsumerProfile = Array<ConsumerProfileDatum>;

```
[^ back to top](#consumer-profile)
