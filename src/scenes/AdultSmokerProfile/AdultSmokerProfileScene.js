// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';

import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import {
  View,
  Text,
  LoadingIndicator,
  Dropdown,
} from '../../general/components/coreUIComponents';
import Persist from '../../general/components/Persist';

import PieChart from '../../general/components/charts/PieChart';
import commaSeparator from '../../general/helpers/commaSeparator';
import SESAdultSmokersChart from './charts/SESAdultSmokersChart';
import AgeAdultSmokersChart from './charts/AgeAdultSmokersChart';

import {TITLE_FONT_SIZE} from '../../general/constants/text';

import type {
  AdultSmokerProfile,
  AdultSmokerProfileData,
} from './types/AdultSmokerProfile-type';

import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = {
  title: string;
  data: AdultSmokerProfileData;
  isLoading: boolean;
  selectedTerritory: string;
  windowWidth: number;
  fetchAdultSmokerProfileData: () => void;
};

type State = {
  territoryList: Array<string>;
  selectedTerritory: string;
};

export class AdultSmokerProfileScene extends Component {
  props: Props;
  state: State;
  _groupedData: Map<string, AdultSmokerProfileData>;

  constructor() {
    super(...arguments);
    autobind(this);
    this._groupedData = new Map();

    this.state = {
      territoryList: [],
      selectedTerritory: this.props.selectedTerritory,
    };
  }

  componentWillMount() {
    let {data, selectedTerritory} = this.props;
    if (data.length === 0) {
      this.props.fetchAdultSmokerProfileData();
    } else {
      this._groupedData = this._groupData(data, selectedTerritory);
      let territoryList = [...new Set(data.map((datum) => datum.territory))];
      this.setState({
        territoryList,
        selectedTerritory,
      });
    }
  }

  componentWillReceiveProps(newProps: Props) {
    let oldProps = this.props;
    let {data, selectedTerritory} = newProps;
    if (
      data.length !== oldProps.data.length ||
      oldProps.selectedTerritory !== selectedTerritory
    ) {
      this._groupedData = this._groupData(data, selectedTerritory);

      let territoryList = [...new Set(data.map((datum) => datum.territory))];
      this.setState({
        territoryList,
        selectedTerritory,
      });
    }
  }

  render() {
    let {title, isLoading, windowWidth} = this.props;
    let {territoryList, selectedTerritory} = this.state;

    let doughnutChartDataList = this._groupedData.get('DONUT');
    let doughnutChartData = [];
    if (doughnutChartDataList) {
      doughnutChartData = doughnutChartDataList.filter(this._filterTerritory);
    }

    let smokerTotalList = this._groupedData.get('SMOKER_TOTAL');
    let smokerTotal = 0;
    if (smokerTotalList) {
      let filteredSmokerTotal = smokerTotalList.filter(this._filterTerritory);
      if (filteredSmokerTotal.length > 0) {
        smokerTotal = filteredSmokerTotal[0].measure;
      }
    }

    let avgList = this._groupedData.get('AVG');
    let avg = 0;
    if (avgList) {
      let filteredAvg = avgList.filter(this._filterTerritory);
      if (filteredAvg.length > 0) {
        avg = filteredAvg[0].measure;
      }
    }

    let sesList = this._groupedData.get('SES');
    let sesData = [];
    if (sesList) {
      sesData = sesList.filter(this._filterTerritory);
    }

    let ageList = this._groupedData.get('AGE');
    let ageData = [];
    if (ageList) {
      ageData = ageList.filter(this._filterTerritory);
    }

    let purPackList = this._groupedData.get('PUR_PACK');
    let purPack = 0;
    if (purPackList) {
      purPack = purPackList.filter(this._filterTerritory);
      if (purPackList.length > 0) {
        purPack = purPackList[0].measure;
      }
    }

    let purStickList = this._groupedData.get('PUR_STICK');
    let purStick = 0;
    if (purStickList) {
      purStick = purStickList.filter(this._filterTerritory);
      if (purStickList.length > 0) {
        purStick = purStickList[0].measure;
      }
    }

    return (
      <Widget
        title={title}
        filters={
          <View style={styles.bottomPadding}>
            <View style={styles.filterItem}>
              <Dropdown
                label="Territory"
                options={territoryList}
                selectedValue={selectedTerritory}
                onSelect={(selectedTerritory) => {
                  this._groupedData = this._groupData(
                    this.props.data,
                    selectedTerritory,
                  );
                  this.setState({selectedTerritory});
                }}
              />
            </View>
          </View>
        }
      >
        <Persist
          data={{
            state: this.state,
            oldProps: {selectedTerritory: this.props.selectedTerritory},
          }}
          onMount={({state, oldProps}) => {
            let {selectedTerritory} = this.props;
            if (
              selectedTerritory !== oldProps.selectedTerritory &&
              selectedTerritory !== state.selectedTerritory
            ) {
              this.setState({
                ...state,
                selectedTerritory,
              });
            } else {
              this.setState(state);
            }
          }}
          name="AdultSmokerProfileState"
        />
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <View style={[styles.flex, windowWidth > 1080 ? styles.root : {}]}>
            <View style={[styles.flex, styles.rightMargin]}>
              {selectedTerritory ? (
                <View
                  style={[
                    styles.bottomMargin,
                    styles.centerContent,
                    styles.verticalPadding,
                    styles.nationalAndZone,
                  ]}
                >
                  <Text>Smoking incidence and daily consumption of</Text>
                  <Text fontWeight="bold" style={{fontSize: TITLE_FONT_SIZE}}>
                    {selectedTerritory || ' '}
                  </Text>
                  <Text>adult smokers</Text>
                </View>
              ) : (
                <View style={styles.bottomMargin}>
                  <PlaceholderView
                    text={`\nPlease select territory first\n `}
                    style={styles.territoryNamePlaceholder}
                  />
                </View>
              )}
              <View style={[styles.flex, styles.bottomMargin]}>
                <View style={styles.summaryTitle}>
                  <Text style={{fontSize: 16}}>Smoking Incidence</Text>
                </View>
                {selectedTerritory ? (
                  doughnutChartData.length > 0 ? (
                    <View
                      style={[
                        styles.flex,
                        styles.nationalAndZone,
                        styles.centerContent,
                      ]}
                    >
                      <PieChart
                        data={doughnutChartData}
                        xAxis="legend"
                        yAxis="measure"
                        labelPosition="outer"
                        showTooltip
                        showLegend
                        centerText={commaSeparator(smokerTotal)}
                        extraProps={{
                          pie: {
                            innerRadius: 60,
                          },
                        }}
                      />
                    </View>
                  ) : (
                    <PlaceholderView
                      text={`No data available for ${selectedTerritory}`}
                    />
                  )
                ) : (
                  <PlaceholderView
                    text="Please select territory first"
                    style={styles.removePlaceholderPadding}
                  />
                )}
              </View>
              <View>
                <View style={styles.summaryTitle}>
                  <Text style={{fontSize: 16}}>Average Daily Consumption</Text>
                </View>
                {selectedTerritory ? (
                  avg ? (
                    <View
                      style={[
                        styles.centerContent,
                        styles.verticalPadding,
                        {backgroundColor: '#E0F2F1'},
                      ]}
                    >
                      <Text fontWeight="bold" style={{fontSize: 16}}>
                        {commaSeparator(avg)} Sticks
                      </Text>
                    </View>
                  ) : (
                    <PlaceholderView
                      text={`No data available for ${selectedTerritory}`}
                      style={[{paddingVertical: 6}]}
                    />
                  )
                ) : (
                  <PlaceholderView
                    text={`No data available for ${selectedTerritory}`}
                    style={[{paddingVertical: 6}]}
                  />
                )}
              </View>
            </View>
            <View style={styles.flex}>
              <View style={[styles.flex, styles.bottomMargin]}>
                <Text style={{fontSize: 16}}>SES Adult Smokers</Text>
                {selectedTerritory ? (
                  sesData.length > 0 ? (
                    <SESAdultSmokersChart data={sesData} />
                  ) : (
                    <PlaceholderView
                      text={`No data available for ${selectedTerritory}`}
                    />
                  )
                ) : (
                  <PlaceholderView text="Please select territory fist" />
                )}
              </View>
              <View style={[styles.flex, styles.bottomMargin]}>
                <Text style={{fontSize: 16}}>Age Adult Smokers</Text>
                {selectedTerritory ? (
                  ageData.length > 0 ? (
                    <AgeAdultSmokersChart data={ageData} />
                  ) : (
                    <PlaceholderView
                      text={`No data available for ${selectedTerritory}`}
                    />
                  )
                ) : (
                  <PlaceholderView text="Please select territory first" />
                )}
              </View>
              <Text style={{fontSize: 16, marginBottom: 5}}>Purchase Mode</Text>
              {selectedTerritory ? (
                purPack || purStick ? (
                  <View style={styles.purchaseSummaryContainer}>
                    <View style={[styles.flex, styles.centerContent]}>
                      <Text fontWeight="bold" style={{fontSize: 16}}>
                        {purPack} By Pack
                      </Text>
                    </View>
                    <View style={[styles.flex, styles.centerContent]}>
                      <Text fontWeight="bold" style={{fontSize: 16}}>
                        {purStick} By Stick
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <PlaceholderView
                      text={`No data available for ${selectedTerritory}`}
                      style={[{paddingVertical: 7}]}
                    />
                  </View>
                )
              ) : (
                <View>
                  <PlaceholderView
                    text="Please select territory first"
                    style={[{paddingVertical: 7}]}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </Widget>
    );
  }

  _groupData(data: AdultSmokerProfileData, selectedTerritory: string) {
    let groupedData = new Map();
    data
      .filter((datum) => datum.territory === selectedTerritory)
      .forEach((datum) => {
        let itemTypeData = groupedData.get(datum.itemType);
        if (itemTypeData) {
          let newListData = [...itemTypeData, datum];
          groupedData.set(datum.itemType, newListData);
        } else {
          groupedData.set(datum.itemType, [datum]);
        }
      });
    return groupedData;
  }

  _filterTerritory(datum: AdultSmokerProfile) {
    return datum.territory === this.state.selectedTerritory;
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  rightMargin: {
    marginRight: 20,
  },
  bottomPadding: {
    paddingBottom: 20,
  },
  bottomMargin: {
    marginBottom: 10,
  },
  verticalPadding: {
    paddingVertical: 5,
  },
  nationalAndZone: {
    backgroundColor: '#E0F2F1',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseSummaryContainer: {
    flexDirection: 'row',
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  summaryTitle: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  territoryNamePlaceholder: {
    paddingVertical: 6,
  },
});

function mapStateToProps(state: RootState) {
  let {selectedTerritory} = state.globalFilter;
  return {
    data: state.adultSmokerProfileState.adultSmokerProfile,
    isLoading: state.adultSmokerProfileState.isLoading,
    selectedTerritory: selectedTerritory || '',
    windowWidth: state.windowSize.width,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchAdultSmokerProfileData: () => {
      dispatch({
        type: 'FETCH_ADULT_SMOKER_PROFILE_REQUESTED',
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AdultSmokerProfileScene,
);
