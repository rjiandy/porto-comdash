// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';

import {Rectangle} from '../../general/components/shapesComponent';
import {
  View,
  Text,
  ErrorComponent,
  LoadingIndicator,
  Dropdown,
} from '../../general/components/coreUIComponents';
import getColorScale from '../../general/helpers/getColorScale';
import Legend from './components/Legend';

import OverlappedBarRechart from '../../general/components/charts/OverlappedBarRechart';
import {Widget} from '../../general/components/UIComponents';
import AchievementTable from './components/charts/achievementTable';
import PieChart from '../../general/components/charts/PieChart';
import {THEME_COLOR} from '../../general/constants/colors';
import {INFORMATION_FONT_SIZE} from '../../general/constants/text';

import type {RootState} from '../../general/stores/RootState';
import type {Community} from './types/Community-type';

type CommunitySceneProps = {
  windowWidth: number;
  fetchCommunityData: () => void;
  communityData: Community;
  isLoading: boolean;
  error: ?Error;
  title: string;
  territory: string;
};

type CommunitySceneState = {
  territoryList: Array<string>;
  selectedTerritory: string;
};

class CommunityScene extends Component {
  props: CommunitySceneProps;
  state: CommunitySceneState;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      territoryList: [],
      selectedTerritory: this.props.territory,
    };
  }

  componentWillMount() {
    let {achievements} = this.props.communityData;
    if (achievements.length === 0) {
      this.props.fetchCommunityData();
    }
  }

  componentWillReceiveProps(nextProps: CommunitySceneProps) {
    let {communityData} = nextProps;
    if (Object.keys(communityData).length > 0) {
      let {programs} = communityData;
      let territoryList = [...new Set(programs.map((datum) => datum.territory))];
      this.setState({
        territoryList,
      });
    }
  }

  render() {
    let {isLoading, error} = this.props;
    return isLoading
      ? this._renderLoadingContent()
      : error ? this._renderErrorContent() : this._renderMainContent();
  }

  _renderLoadingContent() {
    let {title} = this.props;
    return (
      <Widget title={title}>
        <LoadingIndicator />
      </Widget>
    );
  }

  _renderErrorContent() {
    let {title} = this.props;
    return (
      <Widget title={title}>
        <ErrorComponent
          errorMessage="failed to fetch"
          url="/api/communityData"
        />
      </Widget>
    );
  }

  _renderMainContent() {
    let {windowWidth, title, communityData} = this.props;
    let {territoryList, selectedTerritory} = this.state;
    let {
      hobbyDataSet,
      programDataSet,
      informationPromotorData,
      informationCommunityData,
    } = this._setProgramData(communityData.programs);

    let {stackedBarData, tableData} = this._setAchievementData(
      communityData.achievements
    );
    let typedStackedBarData: Array<Object> = stackedBarData;
    return (
      <Widget
        title={title}
        filters={
          <View style={styles.filterContainer}>
            <Dropdown
              label="Territory"
              options={territoryList}
              selectedValue={selectedTerritory}
              onSelect={this._onTerritorySelected}
              containerStyle={styles.rightMargin}
            />
          </View>
        }
      >
        <View
          style={[
            styles.communityContainer,
            windowWidth <= 1024 && {flexDirection: 'column'},
          ]}
        >
          <View
            style={[
              styles.communityProgramWrapper,
              windowWidth <= 1024 && {flex: 1},
            ]}
          >
            <View style={styles.potentialCommunity}>
              <View style={[styles.informationBox, styles.maxDimension]}>
                <Text style={styles.informationText}>
                  {informationCommunityData.measure || 0}
                </Text>
                <Text>Potential Community</Text>
              </View>
              <View style={[styles.informationBox, styles.maxDimension]}>
                <PieChart
                  data={hobbyDataSet}
                  xAxis="label"
                  yAxis="measure"
                  height={200}
                  width={200}
                  showTooltip
                />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}
                >
                  {hobbyDataSet.map((data, index) =>
                    <View
                      key={index}
                      style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                      <Rectangle backgroundColor={data.fill} size={1} />
                      <Text style={{marginLeft: 5}}>
                        {data.label}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={[styles.informationBox, styles.maxDimension]}>
                <PieChart
                  data={programDataSet}
                  xAxis="label"
                  yAxis="measure"
                  height={200}
                  width={200}
                  showTooltip
                />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}
                >
                  {programDataSet.map((data, index) =>
                    <View
                      key={index}
                      style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                      <Rectangle backgroundColor={data.fill} size={1} />
                      <Text style={{marginLeft: 5}}>
                        {data.label}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.communityProgram}>
              <View style={[styles.informationBox]}>
                <Text style={styles.informationText}>
                  {informationPromotorData.measure || 0}
                </Text>
                <Text>Promotor</Text>
              </View>
              <View
                style={[
                  styles.informationBox,
                  {
                    height: 510, // It always this height because the graphs look great in this ratio
                    padding: 20,
                    minWidth: 400,
                  },
                ]}
              >
                {typedStackedBarData.length > 0
                  ? <View>
                      <OverlappedBarRechart
                        data={typedStackedBarData}
                        xAxis="product"
                        yAxis={['brandPrimaryCC', 'brandSecondaryCC']}
                        height={400}
                        showAxis
                        showLabelValue
                        showTooltip
                        // showLegend
                        showChartGrid
                        horizontal
                        extraProps={{
                          tooltip: {
                            dataKeyLabel: {
                              brandPrimaryCC: 'Primary CC',
                              brandSecondaryCC: 'Secondary CC',
                            },
                          },
                          brandPrimaryCC: {
                            dxCoefficient: 0.85,
                          },
                          brandSecondaryCC: {
                            dxCoefficient: 0.5,
                          },
                          yAxis: {
                            width: 80,
                          },
                        }}
                        style={{
                          brandPrimaryCC: {
                            data: {fill: THEME_COLOR},
                          },
                          brandSecondaryCC: {
                            data: {fill: 'salmon'},
                          },
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          justifyContent: 'space-around',
                          width: '100%',
                        }}
                      >
                        {typedStackedBarData &&
                          <Legend
                            legends={[
                              {
                                color: THEME_COLOR,
                                text: 'Primary CC',
                              },
                              {
                                color: 'salmon',
                                text: 'Secondary CC',
                              },
                            ]}
                          />}
                      </View>
                    </View>
                  : <Text>No Data Available</Text>}
              </View>
            </View>
          </View>
          <View style={styles.communityAchievementWrapper}>
            <AchievementTable data={tableData} />
          </View>
        </View>
      </Widget>
    );
  }

  _onTerritorySelected(selectedTerritory: string) {
    this.setState({selectedTerritory});
  }

  _setProgramData(programs) {
    let {selectedTerritory} = this.state;
    let selectedPrograms = programs.filter(
      (program) => program.territory === selectedTerritory
    );
    let COLOR = getColorScale(selectedPrograms);

    return selectedPrograms.reduce(
      (acc, program, index) => {
        if (program.itemType === 'DONUT_HOBBY') {
          acc.hobbyDataSet.push({...program, fill: COLOR(index)});
        } else if (program.itemType === 'DONUT_PROGRAM') {
          acc.programDataSet.push({...program, fill: COLOR(index)});
        } else if (program.itemType === 'COMMUNITY') {
          acc.informationCommunityData = program;
        } else {
          acc.informationPromotorData = program;
        }
        return acc;
      },
      {
        hobbyDataSet: [],
        programDataSet: [],
        informationCommunityData: {},
        informationPromotorData: {},
      }
    );
  }

  _setAchievementData(achievementData) {
    let {selectedTerritory} = this.state;
    let result = achievementData.reduce(
      (acc, achievement) => {
        let {
          territory,
          product,
          brandPrimaryCC,
          brandSecondaryCC,
          CC,
          ECC,
          packSold,
          strikeRate,
        } = achievement;
        if (territory === selectedTerritory) {
          acc.stackedBarData.push({
            brandPrimaryCC,
            brandSecondaryCC,
            product,
          });
          acc.tableData.push({
            product,
            CC,
            ECC,
            packSold,
            strikeRate,
          });
        }
        return acc;
      },
      {
        stackedBarData: [],
        tableData: [],
      }
    );
    return result;
  }
}

let styles = StyleSheet.create({
  communityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 10,
  },
  communityProgramWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  communityAchievementWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    minWidth: 350,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  informationBox: {
    borderWidth: 2,
    borderColor: '#eee',
    elevation: 2,
    padding: 10,
    justifyContent: 'space-around',
    textAlign: 'center',
    marginBottom: 10,
  },
  informationText: {
    fontSize: INFORMATION_FONT_SIZE,
  },
  maxDimension: {
    maxWidth: 300,
    maxHeight: 250,
  },
  potentialCommunity: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  communityProgram: {
    flex: 1,
  },
  communityBar: {
    flex: 1,
    maxWidth: 300,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    padding: 10,
    maxHeight: 520,
  },

  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
  },

  rightMargin: {
    marginRight: 20,
  },
});

export function mapStateToProps(state: RootState) {
  let {data, isLoading, error} = state.communityState;
  return {
    windowWidth: state.windowSize.width,
    communityData: data,
    isLoading,
    error,
    territory: 'Garut', //TODO: Use redux to get it from user (it might be in the shape of Array<Territory>)
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchCommunityData: () => {
      dispatch({type: 'FETCH_COMMUNITY_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunityScene);
