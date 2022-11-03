// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View} from '../../../general/components/coreUIComponents';
import {PlaceholderView} from '../../../general/components/UIComponents';
import PieChart from '../../../general/components/charts/PieChart';
import {MEDIUM_GREY} from '../../../general/constants/colors';
import {SMALL_FONT_SIZE} from '../../../general/constants/text';

import type {LampHOPData} from '../types/lampHOP-type';
type Props = {
  type: 'product' | 'segment' | 'type';
  data: LampHOPData;
  selectedTerritory: ?string;
  selectedBrand: ?string;
  territoryList: Array<string>;
};

export default function LampHOPPieChart(props: Props) {
  let {data, type, selectedTerritory, selectedBrand, territoryList} = props;
  if (!selectedTerritory) {
    return (
      <PlaceholderView
        text="Please select territory first"
        style={styles.placeholder}
      />
    );
  } else if (!selectedBrand) {
    return (
      <PlaceholderView
        text="Please select product first"
        style={styles.placeholder}
      />
    );
  } else if (!territoryList.includes(selectedTerritory)) {
    return (
      <PlaceholderView
        text={`No available ${type} data for territory ${selectedTerritory}`}
        style={styles.placeholder}
      />
    );
  } else if (!data.length) {
    return (
      <PlaceholderView
        text={`No available ${type} data for territory ${selectedTerritory}, product ${selectedBrand}`}
        style={styles.placeholder}
      />
    );
  }
  return (
    <View style={styles.pieChartItem}>
      <PieChart
        data={data}
        xAxis="label"
        yAxis="measure"
        labelPosition="outer"
        showTooltip
        showLegend
        extraProps={{
          legend: {
            wrapperStyle: StyleSheet.flatten(styles.chartLegend),
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pieChartItem: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: MEDIUM_GREY,
    margin: 10,
  },
  placeholder: {
    margin: 10,
  },
  chartLegend: {
    fontSize: SMALL_FONT_SIZE,
    paddingTop: 10,
  },
});
