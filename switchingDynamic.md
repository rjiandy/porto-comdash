### [&laquo; Home](README.md)

# Switching Dynamic

The design spec of **Switching Dynamic** is available on `Commercial Dashboard Design Page 23`. Please refer to the doc to see the visualization.

- [Switching Dynamic](#switching-dynamic)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/industryUpdate`

## Types

```ts
export type SwitchingDynamic = {
  territory: string;
  product: string;
  smokerProfile: string;
  brand: string;
  switchOutValue: number;
  switchNet: number;
  switchInValue: number;
};

export type SwitchingDynamics = Array<SwitchingDynamic>;

```
[^ back to top](#switching-dynamic)
