### [&laquo; Home](README.md)

# Brand And Product Imagery

The design spec of **Brand And Product Imagery** is available on `Commercial Dashboard Design Page 22`. Please refer to the doc to see the visualization.

- [Brand And Product Imagery](#brand-product-imagery)
    - [Resources](#resources)
    - [Types](#types)
    - [Notes](#notes)


## Resources
`/brandAndProductImageryData`

## Types

```ts
type BrandProductImageryData = Array<BrandProductImageryDatum>;

type BrandProductImageryDatum = {
    territory: string;
    itemType: string;
    product: string;
    smokerProfile: string;
    imagery: string;
    measure: number
    lastUpdate: number;
}
```

[^ back to top](#brand-product-imagery)
