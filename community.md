### [&laquo; Home](README.md)

# Community

The design spec of **Comminity** is available on `Commercial Dashboard Design Page 33`. Please refer to the doc to see the visualization.

- [Community](#community)
    - [Resources](#resources)
    - [Types](#types)


## Resources
`/communityData`

## Types

```ts
/* flow */

type Community = {
  programs: Array<Program>;
  achievements: Array<Achievement>;
}

type Program = {
  itemType: string;
  territory: string;
  label: string;
  measure: number;
  lastUpdate: number;
}

type Achievement = {
  territory: string;
  product: string;
  lastUpdate: number;
  brandPrimaryCC: number;
  brandSecondaryCC: number;
  CC: number;
  ECC: number;
  packSold: number;
  strikeRate: number
}

```
[^ back to top](#community)
