### [&laquo; Home](README.md)

# Segment Perfomance

The design spec of **Segment Performance** is available on `Commercial Dashboard Design Page 12`. Please refer to the doc to see the visualization.

- [Segment Perfomance](#segment-performance)
    - [Resources](#resources)
    - [Types](#types)
    - [Notes](#notes)


## Resources
`/segmentPerformance`

## Types

```ts
/* flow */
type SegmentPerformance = {
  flavorSegment: Array<FlavorSegment>;
  bubbleChart: Array<BubbleChart>;
};


type BubbleChart = {
  monthID: number;
  territory: number;
  company: string;
  flavor: string;
  subTypec: 'Low' | 'Medium' | 'Premium' | 'Super Low';
  brand: string;
  somTY: number;
  somLY: number | 'NULL';
  somPCT: number;
};

type FlavorSegment = {
  monthID: number;
  territory: string;
  company: string;
  flavor: string;
  subTypec: 'Low' | 'Medium' | 'Premium' | 'Super Low';
  somTY: number;
  somLY: number | 'NULL';
  somPCT: number;
};
```

## Notes
![notes](https://raw.githubusercontent.com/broerjuang/comdash/cc1a770bf86119e1b546c404c8145b18bb304ab1/segmentPerfomanceNotes.png?token=AHcUoomuJhJz8rNmaJ6O6ZPviajBvOg9ks5Zi-a6wA%3D%3D "Logo Title Text 1")

[^ back to top](#segment-performance)
