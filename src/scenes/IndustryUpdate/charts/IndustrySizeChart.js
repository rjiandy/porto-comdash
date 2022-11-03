// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import BarChart from '../../../general/components/charts/BarRechart';
import LineChart from '../../../general/components/charts/LineRechart';
import commaSeparator from '../../../general/helpers/commaSeparator';
import formatMonthDesc from '../../../general/helpers/formatMonthDesc';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';
import roundDecimal from '../../../general/helpers/roundDecimal';

// import getMATValue from '../helpers/getMATValue';
// import getMATGrowth from '../helpers/getMATGrowth';

import {THEME_COLOR, WHITE, GREY} from '../../../general/constants/colors';
import {
  SMALL_FONT_SIZE,
  TINY_FONT_SIZE,
  TITLE_FONT_SIZE,
} from '../../../general/constants/text';

import type {IndustrySize} from '../types/IndustrySize-type';

type Props = {
  data: Array<IndustrySize>;
  showPlaceholder: boolean;
};

export default function IndustrySizeChart(props: Props) {
  let {data, showPlaceholder} = props;
  let sortedData = data.sort(
    (a, b) => Number(a.timeMonthID) - Number(b.timeMonthID),
  );

  let monthData = sortedData
    .filter((datum) => datum.periodType.toLowerCase() === 'month')
    .map((datum) => ({...datum, monthDesc: formatMonthDesc(datum.monthDesc)}));
  let mmaData = sortedData
    .filter((datum) => datum.periodType.toLowerCase() === '12mma')
    .map((datum) => ({...datum, monthDesc: formatMonthDesc(datum.monthDesc)}));

  let matValue = sortedData
    .filter((datum) => datum.periodType.toLowerCase() === 'mat')
    .pop();

  let domainPadding = 0;
  if (mmaData.length > 0) {
    // NOTE: sort ascending
    let sortedMmaData = mmaData.sort((a, b) => a.volume - b.volume);
    let min = sortedMmaData[0].volume;
    let max = sortedMmaData[sortedMmaData.length - 1].volume;
    domainPadding = (max - min) * 0.2;
  }

  // let today = new Date();
  // let matVolume = getMATValue(monthData, today);
  // let matGrowth = getMATGrowth(monthData, today);

  return (
    <View style={styles.root}>
      <View style={{flex: 1.2}}>
        <Text style={[styles.title, styles.bottomPadding]}>Industry Size</Text>
        {showPlaceholder ? (
          <View>
            <PlaceholderView
              text={`\nPlease select Territory on global filter\n `}
              style={{marginVertical: -5, padding: 1.5}}
            />
          </View>
        ) : (
          <View style={styles.matSegment}>
            <View style={[styles.matContainer, styles.leftMat]}>
              <Text style={styles.matHeader}>MAT Volume</Text>
              <Text style={styles.matValue}>
                {matValue && matValue.volume
                  ? commaSeparator(matValue.volume)
                  : '-'}
              </Text>
              <Text style={styles.matFooter}>mio stc</Text>
            </View>
            <View style={[styles.matContainer, styles.rightMat]}>
              <Text style={styles.matHeader}>MAT Volume Growth</Text>
              <Text style={styles.matValue}>
                {matValue && matValue.growth
                  ? roundDecimal(matValue.growth)
                  : '-'}
              </Text>
              <Text style={styles.matFooter}>procent</Text>
            </View>
          </View>
        )}
        <View style={{flex: 1, paddingTop: 15}}>
          <Text style={styles.title}>MAT Volume (in mio)</Text>
          {showPlaceholder ? (
            <PlaceholderView text="Please select Territory on global filter" />
          ) : (
            <LineChart
              data={[mmaData]}
              xAxis="timeMonthID"
              yAxis="volume"
              tooltipInfo="group"
              showAxis
              showLabelValue
              showTooltip
              showChartGrid
              style={{
                tooltip: {fontSize: SMALL_FONT_SIZE},
                axis: {
                  tickLabels: {fontSize: TINY_FONT_SIZE},
                },
                label: {
                  fontSize: TINY_FONT_SIZE,
                },
              }}
              extraProps={{
                xAxis: {
                  tickFormatter: (label) => getMonthDescByID(String(label)),
                },
                tooltip: {
                  content: CustomTooltip,
                  labelFormatter: (label) => getMonthDescByID(String(label)),
                },
                line: {
                  valueFormatter: (label) => commaSeparator(label),
                },
                yAxis: {
                  domain: [
                    `dataMin - ${domainPadding}`,
                    `dataMax + ${domainPadding}`,
                  ],
                },
                lineChart: {
                  margin: {top: 5, right: 5, bottom: 0, left: 5},
                },
              }}
            />
          )}
        </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.title}>Monthly Industry Size (in mio)</Text>
        {showPlaceholder ? (
          <PlaceholderView text="Please select Territory on global filter" />
        ) : (
          <View style={{flex: 1}}>
            <BarChart
              data={monthData}
              xAxis="timeMonthID"
              yAxis="volume"
              style={{
                bar: {
                  data: {width: 30, fill: THEME_COLOR},
                },
                axis: {
                  tickLabels: {fontSize: TINY_FONT_SIZE},
                },
              }}
              extraProps={{
                label: {
                  labelFormatter: (label) => commaSeparator(label),
                },
                xAxis: {
                  tickFormatter: (tick) => getMonthDescByID(String(tick)),
                },
                bar: {
                  label: MonthIndustrySizeLabel,
                },
                tooltip: {
                  content: CustomTooltip,
                  labelFormatter: (label) => getMonthDescByID(String(label)),
                },
                barChart: {
                  margin: {top: 5, right: 5, bottom: 0, left: 5},
                },
              }}
              showAxis
              showLabelValue
              showChartGrid
              showTooltip
            />
          </View>
        )}
      </View>
    </View>
  );
}

type LabelProps = {
  x: number;
  y: number;
  value: string;
  key: string;
  width: number;
  height: number;
  horizontal: boolean;
};

function MonthIndustrySizeLabel(props: LabelProps) {
  const {x, y, value, width, height, horizontal} = props;
  let label = value;
  if (!horizontal && Math.abs(height) < 17) {
    return null;
  }
  if (horizontal && Math.abs(width) < 20) {
    return null;
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dx={-55}
        dy={width / 1.6}
        textAnchor="middle"
        fill={WHITE}
        style={{fontSize: SMALL_FONT_SIZE, zIndex: 10}}
        transform="rotate(-90)"
      >
        {commaSeparator(label)}
      </text>
    </g>
  );
}

type TooltipProps = {
  payload: Array<{[key: string]: any}>;
  label: string;
  labelFormatter?: (label: string) => string;
};

function CustomTooltip(props: TooltipProps) {
  let {payload, label, labelFormatter} = props;
  let noDupePayload = [];
  for (let data of payload) {
    if (!noDupePayload.find((el) => el.name === data.name)) {
      noDupePayload.push(data);
    }
  }
  let dataLabel = label;
  if (label && labelFormatter) {
    dataLabel = labelFormatter(label);
  }
  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipTitle}>{dataLabel}</Text>
      {noDupePayload.map((data, index) => {
        return (
          <Text key={index} style={{color: data.stroke}}>
            {commaSeparator(data.value)}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    textAlign: 'center',
  },
  bottomPadding: {
    paddingBottom: 5,
  },
  matSegment: {
    flexDirection: 'row',
  },
  matContainer: {
    flex: 1,
    flexDirection: 'column',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  rightMat: {
    marginLeft: 10,
    marginRight: 5,
  },
  leftMat: {
    marginRight: 10,
    marginLeft: 5,
  },
  matHeader: {
    fontSize: 10,
    textAlign: 'center',
  },
  matValue: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 3,
  },
  matFooter: {
    fontSize: 10,
    textAlign: 'center',
  },
  tooltipContainer: {
    backgroundColor: WHITE,
    borderColor: GREY,
    borderWidth: 1,
    padding: 10,
  },
  tooltipTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
