// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';

import Persist from '../../general/components/Persist';
import commaSeparator from '../../general/helpers/commaSeparator';
import BarChart from '../../general/components/charts/BarRechart';
import OverlappedBarChart from '../../general/components/charts/OverlappedBarRechart';

import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import {
  View,
  Text,
  Dropdown,
  LoadingIndicator,
  ErrorComponent,
} from '../../general/components/coreUIComponents';
import {SMALL_FONT_SIZE} from '../../general/constants/text';
import {
  DARKER_BLUE,
  MAIN_BLUE,
  LIGHT_BLUE,
  ECC,
} from '../../general/constants/colors';

import type {
  ChannelSummaryState,
  ChannelSummary,
} from './types/ChannelSummary-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type State = {
  territoryOptions: Array<string>;
  brandFamilyOptions: Array<string>;
  selectedTerritory: string;
  selectedBrandFamily: string;
};

type Props = ChannelSummaryState & {
  title: string;
  selectedTerritory: string;
  selectedBrandFamily: string;
  fetchChannelSummaryData: () => void;
};

class ChannelSummaryScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      territoryOptions: [],
      brandFamilyOptions: [],
      selectedTerritory: '',
      selectedBrandFamily: '',
    };
  }

  componentWillMount() {
    let {channelSummaryData, fetchChannelSummaryData} = this.props;
    if (channelSummaryData.length === 0) {
      fetchChannelSummaryData();
    } else {
      this._initiateFilters(this.props);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let {channelSummaryData} = nextProps;
    if (channelSummaryData.length !== this.props.channelSummaryData) {
      this._initiateFilters(nextProps);
    }
  }

  _initiateFilters(props: Props) {
    let {channelSummaryData, selectedTerritory, selectedBrandFamily} = props;
    this.setState({
      territoryOptions: [
        ...new Set(channelSummaryData.map(({territory}) => territory)),
      ],
      brandFamilyOptions: [
        ...new Set(channelSummaryData.map(({brandFamily}) => brandFamily)),
      ],
      selectedTerritory,
      selectedBrandFamily,
    });
  }

  _groupData(): Map<string, Array<ChannelSummary>> {
    let {channelSummaryData} = this.props;
    let {selectedTerritory, selectedBrandFamily} = this.state;
    let groupedData = new Map();
    let filteredData = channelSummaryData.filter(
      ({territory, brandFamily}) =>
        selectedTerritory === territory && selectedBrandFamily === brandFamily,
    );
    for (let datum of filteredData) {
      let existing = [];
      if (groupedData.has(datum.itemType)) {
        existing = groupedData.get(datum.itemType) || [];
      }
      existing.push(datum);
      groupedData.set(datum.itemType, existing);
    }
    return groupedData;
  }

  render() {
    let {channelSummaryData, title, isLoading, error} = this.props;
    let {selectedTerritory, selectedBrandFamily} = this.state;
    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      content = (
        <ErrorComponent
          url="/ChannelSummaryData"
          errorMessage={error.message}
        />
      );
    } else {
      let groupedData = this._groupData();
      let tarps = ((groupedData.get('') || [])[0] || {}).measure;
      let siteOoh = ((groupedData.get('SITE_OOH') || [])[0] || {}).measure;
      let airingVisual = ((groupedData.get('') || [])[0] || {}).measure;
      let pposm = ((groupedData.get('') || [])[0] || {}).measure;
      let teamDst = ((groupedData.get('TEAM_DST') || [])[0] || {}).measure;
      let eventMiddle = ((groupedData.get('EVENT_DAYS') || [])[0] || {})
        .measure;
      let contract = ((groupedData.get('CONTRACT') || [])[0] || {}).measure;
      let activation = ((groupedData.get('ACTIVATION') || [])[0] || {}).measure;
      let cp = ((groupedData.get('CP') || [])[0] || {}).measure;
      let eventRight = ((groupedData.get('') || [])[0] || {}).measure;
      let sba = ((groupedData.get('') || [])[0] || {}).measure;
      let participant = ((groupedData.get('') || [])[0] || {}).measure;
      let submitter = ((groupedData.get('') || [])[0] || {}).measure;
      let audienceEvent = (groupedData.get('AUDIENCE_EVENT') || [])[0];
      let audienceActivation = (groupedData.get('AUDIENCE_ACTIVATION') ||
        [])[0];
      let dstCc = (groupedData.get('DST_CC') || [])[0];
      let dstEcc = (groupedData.get('DST_ECC') || [])[0];
      let lampCc = (groupedData.get('LAMP_CC') || [])[0];
      let lampEcc = (groupedData.get('LAMP_ECC') || [])[0];
      let eventCc = (groupedData.get('EVENT_CC') || [])[0];
      let eventEcc = (groupedData.get('EVENT_ECC') || [])[0];
      let comtrialCc = (groupedData.get('COMTRIAL_CC') || [])[0];
      let comtrialEcc = (groupedData.get('COMTRIAL_CC') || [])[0];

      let audienceData = [audienceEvent, audienceActivation].filter(
        (data) => data,
      );
      let maxAudienceMeasure = audienceData.reduce(
        (max, {measure}) => (measure > max ? measure : max),
        0,
      );
      let groupedCcEccData = new Map();
      [
        dstCc,
        dstEcc,
        lampCc,
        lampEcc,
        eventCc,
        eventEcc,
        comtrialCc,
        comtrialEcc,
      ]
        .filter((data) => data)
        .forEach((data) => {
          let existing = [];
          if (groupedCcEccData.has(data.label)) {
            existing = groupedCcEccData.get(data.label) || [];
          }
          existing.push(data);
          groupedCcEccData.set(data.label, existing);
        });
      let flattenedCcEccData = [...groupedCcEccData.values()].map((data) => {
        let result = {};
        let cc = 0;
        let ecc = 0;
        for (let datum of data) {
          let {measure, ...other} = datum;
          if (datum.itemType.endsWith('ECC')) {
            ecc = datum.measure;
          } else {
            cc = datum.measure;
          }
          result = {...result, ...other, cc, ecc};
        }
        return result;
      });
      let maxCcEccMeasure = flattenedCcEccData.reduce((max, {cc, ecc}) => {
        if (max > cc && max > ecc) {
          return max;
        }
        if (cc > ecc) {
          return cc;
        }
        return ecc;
      }, 0);

      let dataExistForBrand = channelSummaryData.filter(
        ({brandFamily}) => selectedBrandFamily === brandFamily,
      );

      content = (
        <View style={[styles.flex, styles.rowFlexed]}>
          <View style={[styles.rightMarginTen, {flex: 1.2}]}>
            <View style={styles.flex}>
              <View
                style={[
                  styles.flex,
                  styles.topMarginTen,
                  tarps && styles.leftBox,
                ]}
              >
                {tarps != null ? (
                  <View>
                    <Text fontWeight="bold" style={styles.valueFontSize}>
                      {commaSeparator(tarps)}
                    </Text>
                    <Text>Tarps</Text>
                  </View>
                ) : (
                  <PlaceholderView
                    text={
                      !dataExistForBrand
                        ? `No data available for ${selectedBrandFamily}`
                        : `No data available for ${selectedTerritory}`
                    }
                  />
                )}
              </View>
            </View>
            <View style={styles.flex}>
              <View
                style={[
                  styles.flex,
                  styles.topMarginTen,
                  siteOoh && styles.leftBox,
                ]}
              >
                {siteOoh != null ? (
                  <View>
                    <Text fontWeight="bold" style={styles.valueFontSize}>
                      {commaSeparator(siteOoh)}
                    </Text>
                    <Text>Site OOH</Text>
                  </View>
                ) : (
                  <PlaceholderView
                    text={
                      !dataExistForBrand
                        ? `No data available for ${selectedBrandFamily}`
                        : `No data available for ${selectedTerritory}`
                    }
                  />
                )}
              </View>
            </View>
            <View style={styles.flex}>
              <View
                style={[
                  styles.flex,
                  styles.topMarginTen,
                  airingVisual && styles.leftBox,
                ]}
              >
                {airingVisual != null ? (
                  <View>
                    <Text fontWeight="bold" style={styles.valueFontSize}>
                      {commaSeparator(airingVisual)}
                    </Text>
                    <Text>Airing Visual</Text>
                  </View>
                ) : (
                  <PlaceholderView
                    text={
                      !dataExistForBrand
                        ? `No data available for ${selectedBrandFamily}`
                        : `No data available for ${selectedTerritory}`
                    }
                  />
                )}
              </View>
            </View>
            <View style={styles.flex}>
              <View
                style={[
                  styles.flex,
                  styles.topMarginTen,
                  pposm && styles.leftBox,
                ]}
              >
                {pposm != null ? (
                  <View>
                    <Text fontWeight="bold" style={styles.valueFontSize}>
                      {commaSeparator(pposm)}
                    </Text>
                    <Text>PPOSM</Text>
                  </View>
                ) : (
                  <PlaceholderView
                    text={
                      !dataExistForBrand
                        ? `No data available for ${selectedBrandFamily}`
                        : `No data available for ${selectedTerritory}`
                    }
                  />
                )}
              </View>
            </View>
          </View>
          <View style={[styles.rightMarginTen, {flex: 4}]}>
            <View style={styles.flex}>
              <View
                style={[styles.rowFlexed, styles.flex, styles.topMarginTen]}
              >
                <View
                  style={[
                    styles.flex,
                    teamDst && styles.middleBox,
                    teamDst && {borderRightWidth: 0},
                  ]}
                >
                  {teamDst != null ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {teamDst}
                      </Text>
                      <Text>Team DST</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
                <View
                  style={[
                    styles.flex,
                    eventMiddle && styles.middleBox,
                    eventMiddle && {borderRightWidth: 0},
                    !eventMiddle &&
                      teamDst && {
                        borderLeftWidth: 4,
                        borderColor: MAIN_BLUE,
                        borderLeftStyle: 'solid',
                      },
                  ]}
                >
                  {eventMiddle != null ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {eventMiddle}
                      </Text>
                      <Text>Event</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
                <View
                  style={[
                    {flex: 2},
                    (contract || activation) && styles.middleBox,
                    (contract || activation) && {borderRightWidth: 0},
                    !(contract || activation) &&
                      eventMiddle && {
                        borderLeftWidth: 4,
                        borderColor: MAIN_BLUE,
                        borderLeftStyle: 'solid',
                      },
                  ]}
                >
                  {contract != null || activation != null ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {commaSeparator(contract || 0)}/{commaSeparator(activation || 0)}
                      </Text>
                      <Text>Contract/Activation</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
                <View
                  style={[
                    styles.flex,
                    cp && styles.middleBox,
                    !cp &&
                      (contract || activation) && {
                        borderLeftWidth: 4,
                        borderColor: MAIN_BLUE,
                        borderLeftStyle: 'solid',
                      },
                  ]}
                >
                  {cp ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {cp}
                      </Text>
                      <Text>CP</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
              </View>
            </View>
            <View style={{flex: 3}}>
              <View
                style={[styles.topMarginTen, styles.rowFlexed, styles.flex]}
              >
                <View
                  style={[
                    styles.flex,
                    styles.rightMarginTen,
                    flattenedCcEccData.length > 0 && styles.middleBox,
                    flattenedCcEccData.length > 0 && styles.tenPadding,
                  ]}
                >
                  {flattenedCcEccData.length > 0 ? (
                    <View style={styles.flex}>
                      <Text>CC & ECC</Text>
                      <View style={styles.flex}>
                        <OverlappedBarChart
                          data={flattenedCcEccData}
                          xAxis="label"
                          yAxis={['ecc', 'cc']}
                          style={{
                            ecc: {
                              data: {width: 20, fill: ECC},
                            },
                            cc: {
                              data: {width: 20, fill: MAIN_BLUE},
                            },
                          }}
                          extraProps={{
                            cc: {
                              labelPlacement: 'outside',
                              labelFormatter: commaSeparator,
                              yAxisId: 0,
                            },
                            ecc: {
                              labelPlacement: 'outside',
                              labelFormatter: commaSeparator,
                              yAxisId: 0,
                            },
                            yAxis: {
                              width: 60,
                              tick: {fontSize: SMALL_FONT_SIZE, width: 60},
                            },
                            xAxis: {
                              domain: [0, 1.2 * maxCcEccMeasure],
                            },
                            tooltip: {
                              valueFormatter: commaSeparator,
                            },
                          }}
                          horizontal
                          showAxis
                          showLabelValue
                          showTooltip
                        />
                      </View>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
                <View
                  style={[
                    styles.flex,
                    audienceData.length > 0 && styles.middleBox,
                    audienceData.length > 0 && styles.tenPadding,
                  ]}
                >
                  {audienceData.length > 0 ? (
                    <View style={styles.flex}>
                      <Text>Audience</Text>
                      <View style={styles.flex}>
                        <BarChart
                          data={audienceData}
                          xAxis="label"
                          yAxis="measure"
                          style={{
                            bar: {
                              data: {
                                fill: MAIN_BLUE,
                                width: 50,
                              },
                            },
                          }}
                          extraProps={{
                            bar: {
                              tickPlacement: 'outside',
                              labelFormatter: commaSeparator,
                            },
                            tooltip: {
                              valueFormatter: commaSeparator,
                            },
                            yAxis: {
                              domain: [0, 1.2 * maxAudienceMeasure],
                            },
                          }}
                          showAxis
                          showLabelValue
                          showTooltip
                        />
                      </View>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 1.5}}>
            <View style={[styles.flex, styles.topMarginTen]}>
              <View style={[styles.flex, styles.rowFlexed]}>
                <View
                  style={[
                    styles.flex,
                    eventRight && styles.rightBox,
                    eventRight && {borderRightWidth: 0},
                  ]}
                >
                  {eventRight != null ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {eventRight}
                      </Text>
                      <Text>Event</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
                <View
                  style={[
                    styles.flex,
                    sba && styles.rightBox,
                    !sba &&
                      eventRight && {
                        borderLeftWidth: 4,
                        borderColor: LIGHT_BLUE,
                        borderLeftStyle: 'solid',
                      },
                  ]}
                >
                  {sba != null ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {sba}
                      </Text>
                      <Text>SBA</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
              </View>
            </View>
            <View style={{flex: 2}}>
              <View style={[styles.flex, styles.topMarginTen]}>
                <View
                  style={[
                    styles.flex,
                    participant && styles.rightBox,
                    participant && {borderBottomWidth: 0},
                  ]}
                >
                  {participant != null ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {commaSeparator(participant)}
                      </Text>
                      <Text>Participant</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
                <View
                  style={[
                    styles.flex,
                    submitter && styles.rightBox,
                    !submitter &&
                      participant && {
                        borderTopWidth: 4,
                        borderColor: LIGHT_BLUE,
                        borderLeftStyle: 'solid',
                      },
                  ]}
                >
                  {submitter != null ? (
                    <View>
                      <Text fontWeight="bold" style={styles.valueFontSize}>
                        {commaSeparator(submitter)}
                      </Text>
                      <Text>Submitter</Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={
                        !dataExistForBrand
                          ? `No data available for ${selectedBrandFamily}`
                          : `No data available for ${selectedTerritory}`
                      }
                    />
                  )}
                </View>
                <View />
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      <Widget title={title} filters={this._renderFilters()}>
        <Persist
          name="channelSummary"
          data={{
            state: this.state,
            oldProps: {
              selectedTerritory: this.props.selectedTerritory,
              selectedBrandFamily: this.props.selectedBrandFamily,
            },
          }}
          onMount={({state, oldProps}) => {
            let {selectedBrandFamily, selectedTerritory} = this.props;
            let newBrandFamily = state.selectedBrandFamily;
            let newTerritory = state.selectedTerritory;
            if (
              selectedBrandFamily !== oldProps.selectedBrandFamily &&
              selectedBrandFamily !== newBrandFamily
            ) {
              newBrandFamily = selectedBrandFamily;
            }
            if (
              selectedTerritory !== oldProps.selectedTerritory &&
              newTerritory !== newBrandFamily
            ) {
              newTerritory = selectedTerritory;
            }
            this.setState({
              ...state,
              selectedBrandFamily: newBrandFamily,
              selectedTerritory: newTerritory,
            });
          }}
        />
        {content}
      </Widget>
    );
  }

  _renderFilters() {
    let {
      territoryOptions,
      brandFamilyOptions,
      selectedTerritory,
      selectedBrandFamily,
    } = this.state;
    return (
      <View style={styles.filterContainer}>
        <Dropdown
          label="Brand"
          options={brandFamilyOptions}
          selectedValue={selectedBrandFamily}
          onSelect={(selectedBrandFamily) => this.setState({selectedBrandFamily})}
          containerStyle={styles.rightMargin}
        />
        <Dropdown
          label="Territory"
          options={territoryOptions}
          selectedValue={selectedTerritory}
          onSelect={(selectedTerritory) => this.setState({selectedTerritory})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  filterContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingBottom: 20,
  },
  rightMargin: {
    marginRight: 15,
  },
  rightMarginTen: {
    marginRight: 10,
  },
  topMargin: {
    marginTop: 15,
  },
  topMarginTen: {
    marginTop: 10,
  },
  valueFontSize: {
    fontSize: 35,
  },
  tenPadding: {
    padding: 10,
  },
  leftBox: {
    borderColor: DARKER_BLUE,
    borderWidth: 4,
    justifyContent: 'center',
    textAlign: 'center',
  },
  middleBox: {
    borderColor: MAIN_BLUE,
    borderWidth: 4,
    justifyContent: 'center',
    textAlign: 'center',
  },
  rightBox: {
    borderColor: LIGHT_BLUE,
    borderWidth: 4,
    justifyContent: 'center',
    textAlign: 'center',
  },
});

function mapStateToProps(state: RootState) {
  return {
    ...state.channelSummaryState,
    ...state.globalFilter,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchChannelSummaryData: () => {
      dispatch({type: 'FETCH_CHANNEL_SUMMARY_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ChannelSummaryScene,
);
