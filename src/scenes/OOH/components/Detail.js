// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {View, Text} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import PieChart from '../../../general/components/charts/PieChart';
import BarChart from '../../../general/components/charts/BarRechart';

import {THEME_COLOR, MEDIUM_GREY} from '../../../general/constants/colors';

import type {OOHDetailData} from '../type/OOH-type';

type Props = {
  data: OOHDetailData;
  selectedTerritory: string;
  selectedType: string;
};

export default function Detail(props: Props) {
  let {data, selectedTerritory, selectedType} = props;

  let filteredData = data.filter((datum) => datum.oohType === selectedType);

  let siteData = filteredData.filter((datum) => datum.itemType === 'SITE');

  let visualData = filteredData.filter((datum) => datum.itemType === 'VISUAL');

  let siteDataContent;
  if (siteData.length > 0) {
    siteDataContent = (
      <View style={[styles.chartItem, styles.borderContainer]}>
        <Text customStyle="title">By Site</Text>
        <PieChart
          data={siteData}
          xAxis="label"
          yAxis="measure"
          showTooltip
          showLegend
          showLabelValue
        />
      </View>
    );
  } else {
    siteDataContent = (
      <PlaceholderView
        text={`No site data available for territory ${selectedTerritory}, OOH type ${selectedType}`}
      />
    );
  }

  let visualDataContent;
  if (visualData.length > 0) {
    visualDataContent = (
      <View style={[styles.chartItem, styles.borderContainer]}>
        <Text customStyle="title">By Visual</Text>
        <BarChart
          data={visualData}
          xAxis="label"
          yAxis="measure"
          horizontal
          showTooltip
          showLabelValue
          showChartGrid
          extraProps={{
            bar: {
              fill: THEME_COLOR,
            },
          }}
        />
      </View>
    );
  } else {
    visualDataContent = (
      <PlaceholderView
        text={`No visual data available for territory ${selectedTerritory}, OOH type ${selectedType}`}
      />
    );
  }
  return (
    <View style={styles.root}>
      <View style={styles.flex}>
        {!selectedType ? (
          <PlaceholderView text="Please select OOH type first" />
        ) : (
          <View style={styles.chartContainer}>
            {siteDataContent}
            {visualDataContent}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
  },
  flex: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  noDataAvailable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noDataAvailableText: {
    textAlign: 'center',
  },
  chartItem: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: MEDIUM_GREY,
  },
});
