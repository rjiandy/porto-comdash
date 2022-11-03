// @flow
import React, {Component} from 'react';
import {ResponsiveContainer, Treemap, Tooltip} from 'recharts';

import commaSeparator from '../../general/helpers/commaSeparator';

import {View, Text} from '../../general/components/coreUIComponents';
import {WHITE, GREY} from '../../general/constants/colors';

import type {TerritoryComparison} from './types/TerritoryComparison-type';

type VolumeMode = 'SOM' | 'VOL';

let getVolumeModeColor = (
  vol,
  selectedVolumeMode: VolumeMode,
  // isNegativePCT,
) => {
  if (selectedVolumeMode === 'VOL') {
    if (vol < 100) {
      return '#af2a2a';
    } else if (vol <= 105) {
      return '#e8c725';
    } else {
      return '#418728';
    }
  } else {
    // let actualVol = isNegativePCT ? vol * -1 : vol;
    if (vol <= -0.3) {
      return '#af2a2a';
    } else if (vol < 0.3) {
      return '#e8c725';
    } else {
      return '#418728';
    }
  }
};

type CustomizedContentProps = {
  dataKey: string;
} & Object;

class CustomizedContent extends Component {
  props: CustomizedContentProps;
  render() {
    let {
      x,
      y,
      width,
      height,
      // isNegativePCT,
      valuePCT,
      itemType,
      depth,
      name,
    } = this.props;
    let minWidth = 30;
    if (name) {
      if (name.length > 20) {
        minWidth = 130;
      } else if (name.length > 15) {
        minWidth = 110;
      } else if (name.length > 10) {
        minWidth = 90;
      } else if (name.length > 7) {
        minWidth = 70;
      } else if (name.length > 4) {
        minWidth = 50;
      }
    }
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill:
              depth < 2
                ? getVolumeModeColor(
                    valuePCT,
                    itemType,
                    // isNegativePCT,
                  )
                : 'none',
            stroke: WHITE,
            strokeWidth: 1 / (depth + 1e-10),
            strokeOpacity: 0.5 / (depth + 1e-10),
          }}
        />
        {depth === 1 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill={WHITE}
            fontWeight="normal"
            fontSize={12}
          >
            {height < 15 ? null : name && width < minWidth ? null : name}
          </text>
        ) : null}
      </g>
    );
  }
}

type TreeViewProps = TerritoryComparison & {
  name: string;
  isNegativePCT: boolean;
};

type State = {
  isTooltipActive: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  data: Array<TreeViewProps>;
  dataKey: string;
};

class TerritoryTreeMap extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    this.state = {
      isTooltipActive: false,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  render() {
    let {data, dataKey} = this.props;
    let content =
      data.length === 0 ? (
        <h1>No Available Data</h1>
      ) : (
        <ResponsiveContainer>
          <Treemap
            data={data}
            dataKey={dataKey}
            stroke={WHITE}
            fill="#8884d8"
            content={<CustomizedContent dataKey={dataKey} />}
            animationDuration={500}
            animationEasing="ease-out"
          >
            <Tooltip
              content={(tooltipProps) => {
                if (tooltipProps.payload[0]) {
                  let payload = tooltipProps.payload[0].payload;
                  let {valueTY, valuePCT, territory, isNegativePCT} = payload;
                  let actualValue = valueTY;
                  if (payload.itemType === 'SOM' && isNegativePCT) {
                    actualValue = valueTY * -1;
                  }
                  return (
                    <View
                      style={{
                        backgroundColor: WHITE,
                        borderColor: GREY,
                        borderWidth: 1,
                        padding: 10,
                      }}
                    >
                      <Text>{territory}</Text>
                      <Text>
                        {commaSeparator(Number(actualValue.toFixed(1)))} ({valuePCT}%)
                      </Text>
                    </View>
                  );
                }
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      );
    return content;
  }
}

export default TerritoryTreeMap;
