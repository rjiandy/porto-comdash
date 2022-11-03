### [&laquo; Home](README.md)

# Smoker Profile

The design spec of **Smoker Profile** is available on `Commercial Dashboard Design Page 11`. Please refer to the doc to see the visualization.

- [Smoker Profile](#smoker-profile)
    - [Resources](#resources)
    - [Types](#types)
    - [Notes](#notes)


## Resources
`/smokerProfile`

## Types

```ts
export type SmokerProfile = {
  territory: string;
  product: string;
  itemType: string;
  legend: string;
  measure: number;
};

export type SmokerProfiles = Array<SmokerProfile>;
```

## Notes
[1. About the requirement ](https://slack-files.com/T0KTPMMPS-F6JULV2UR-a9cd31ef36)

[^ back to top](#smoker-profile)
