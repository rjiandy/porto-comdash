// @flow

import React, {Component} from 'react';
import ReactBubbleChart from 'kf-react-bubble-chart';
import autobind from 'class-autobind';

import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';

import getGrowthColor from '../../general/helpers/getGrowthColor';
import roundDecimal from '../../general/helpers/roundDecimal';
import formatBubbleChart from './helpers/formatBubbleChart';
import groupBySubtypecAndFlavor from './helpers/groupBySubtypecAndFlavor';

import Persist from '../../general/components/Persist';

import {Dropdown} from '../../general/components/coreUIComponents';
import {PlaceholderView} from '../../general/components/UIComponents';
import {GROWTH_COLOR, LIGHT_GREY, WHITE} from '../../general/constants/colors';
import {SUB_TYPEC, FLAVOR} from './constants';
import {Widget} from '../../general/components/UIComponents';
import {
  View,
  Text,
  LoadingIndicator,
  ErrorComponent,
} from '../../general/components/coreUIComponents';

import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';
import type {
  SegmentPerformance,
  BubbleChart,
  VolumeGrowth,
} from './types/SegmentPerformance-type';

type Props = {
  dataSource: {
    bubbleChartData: Array<BubbleChart>;
    flavorSegmentData: Array<SegmentPerformance>;
    volumeGrowthData: Array<VolumeGrowth>;
  };
  title: string;
  selectedTerritory: string;
  isLoading: boolean;
  error?: Error;
  fetchSegmentPerformanceData: () => void;
};
type State = {
  companyOptions: Array<string>;
  territoryOptions: Array<string>;
  selectedCompany: string;
  selectedTerritory: string;
};

export class SegmentPerformanceScene extends Component {
  state: State;
  props: Props;

  _colorLegend: Array<{color: string; textColor: string}>;

  constructor() {
    super(...arguments);
    autobind(this);
    this._colorLegend = [
      {
        color: GROWTH_COLOR.low,
        textColor: 'white',
      },
      {color: GROWTH_COLOR.middle, textColor: 'white'},
      {color: GROWTH_COLOR.high, textColor: 'white'},
    ];
    this.state = {
      selectedCompany: '',
      selectedTerritory: '',
      territoryOptions: [],
      companyOptions: [],
    };
  }

  componentWillMount() {
    let {dataSource, fetchSegmentPerformanceData} = this.props;
    this.setState({selectedTerritory: this.props.selectedTerritory});
    if (dataSource.bubbleChartData.length === 0) {
      fetchSegmentPerformanceData();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.dataSource.bubbleChartData.length > 0 &&
      nextProps.dataSource.flavorSegmentData.length > 0
    ) {
      let companyOptions = Array.from(
        new Set(
          [
            ...nextProps.dataSource.flavorSegmentData.map(
              ({company, sortOrderCompany}) => ({company, sortOrderCompany}),
            ),
          ]
            .sort((a, b) => a.sortOrderCompany - b.sortOrderCompany)
            .map(({company}) => company),
        ),
      );
      let territoryOptions = Array.from(
        new Set(
          [
            ...nextProps.dataSource.flavorSegmentData.map(
              ({territory, sortOrderTerritory}) => ({
                territory,
                sortOrderTerritory,
              }),
            ),
          ]
            .sort((a, b) => a.sortOrderTerritory - b.sortOrderTerritory)
            .map(({territory}) => territory),
        ),
      );

      if (
        this.props.selectedTerritory !== nextProps.selectedTerritory &&
        this.state.selectedTerritory !== nextProps.selectedTerritory
      ) {
        this.setState({selectedTerritory: nextProps.selectedTerritory});
      }

      this.setState({
        companyOptions,
        territoryOptions,
        selectedCompany: companyOptions[0],
      });
    }
  }

  render() {
    let {isLoading} = this.props;
    if (isLoading) {
      return (
        <Widget title="Segment Performance">
          <LoadingIndicator />
        </Widget>
      );
    } else {
      return (
        <Widget
          title="Segment Performance"
          filters={
            <View style={styles.filterContentDropDown}>
              <View style={styles.rightPadding}>
                <Dropdown
                  label="Territory"
                  selectedValue={this.state.selectedTerritory}
                  onSelect={(value) => this.setState({selectedTerritory: value})}
                  options={this.state.territoryOptions}
                />
              </View>
              <View>
                <Dropdown
                  label="Company"
                  selectedValue={this.state.selectedCompany}
                  onSelect={(value) => this.setState({selectedCompany: value})}
                  options={this.state.companyOptions}
                  disabled={!this.state.companyOptions.length}
                />
              </View>
            </View>
          }
        >
          <Persist
            name="segmentPerformanceState"
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
          />
          {this._renderContent()}
        </Widget>
      );
    }
  }

  _renderContent() {
    let {isLoading, error, dataSource} = this.props;
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (error) {
      return (
        <ErrorComponent
          url="/SegmentPerformanceData"
          errorMessage={error.message}
        />
      );
    }
    let {bubbleChartData, flavorSegmentData, volumeGrowthData} = dataSource;
    let {selectedCompany, selectedTerritory} = this.state;

    let volumeData = volumeGrowthData.filter(
      ({company, territory}) =>
        company === selectedCompany && territory === selectedTerritory,
    )[0];
    let groupedBubbleChart = groupBySubtypecAndFlavor(
      bubbleChartData.filter(
        ({company, territory}) =>
          company === selectedCompany && territory === selectedTerritory,
      ),
    );
    let groupedFlavorSegment = groupBySubtypecAndFlavor(
      flavorSegmentData.filter(
        ({company, territory}) =>
          company === selectedCompany && territory === selectedTerritory,
      ),
    );
    let sumOfFlavor = flavorSegmentData.filter(
      ({company, subTypec, territory}) => {
        return (
          company === selectedCompany &&
          subTypec === 'All' &&
          territory === selectedTerritory
        );
      },
    );
    let sumOfSubTypec = flavorSegmentData.filter(
      ({company, flavor, territory}) => {
        return (
          company === selectedCompany &&
          flavor === 'All' &&
          territory === selectedTerritory
        );
      },
    );
    if (!selectedTerritory || !selectedCompany) {
      return !selectedTerritory ? (
        <PlaceholderView text="Please select Territory on global filter" />
      ) : (
        <PlaceholderView text="Please select Company" />
      );
    } else {
      return (
        <View style={[styles.flex, styles.flexRow, styles.justifyContent]}>
          <View style={styles.flex}>
            <View style={[styles.flex, styles.flexRow]}>
              <View style={[styles.flex, styles.boxSegment]}>
                <VolumeSummary data={volumeData} />
              </View>
              {FLAVOR.map((flavor, index) => {
                let sumData;
                for (let sumItem of sumOfFlavor) {
                  if (sumItem.flavor === flavor) {
                    sumData = sumItem;
                    break;
                  }
                }
                return (
                  <View
                    key={index}
                    style={[
                      styles.flex,
                      styles.boxSegment,
                      {
                        backgroundColor: getGrowthColor(
                          sumData && sumData.somPCT ? sumData.somPCT : 0.0,
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.segmentHeader}>{flavor}</Text>
                    <Text style={styles.segmentValue}>
                      {sumData && sumData.somTY
                        ? roundDecimal(sumData.somTY)
                        : 0.0}
                    </Text>
                    <Text style={styles.segmentValue}>
                      {sumData && sumData.somPCT
                        ? roundDecimal(sumData.somPCT)
                        : 0.0}
                    </Text>
                  </View>
                );
              })}
            </View>
            {SUB_TYPEC.map((subTypec, indexSub) => {
              let sumData;
              for (let sumItem of sumOfSubTypec) {
                if (sumItem.subTypec === subTypec) {
                  sumData = sumItem;
                  break;
                }
              }
              return (
                <View key={indexSub} style={[styles.flex, styles.flexRow]}>
                  <View
                    style={[
                      styles.flex,
                      styles.boxSegment,
                      {
                        backgroundColor: getGrowthColor(
                          sumData && sumData.somPCT ? sumData.somPCT : 0.0,
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.segmentHeader}>{subTypec}</Text>
                    <Text style={styles.segmentValue}>
                      {sumData && sumData.somTY
                        ? roundDecimal(sumData.somTY)
                        : 0.0}
                    </Text>
                    <Text style={styles.segmentValue}>
                      {sumData && sumData.somPCT
                        ? roundDecimal(sumData.somPCT)
                        : 0.0}
                    </Text>
                  </View>
                  {FLAVOR.map((flavor, index) => {
                    let key = subTypec + '-' + flavor;
                    let flavorSegment = groupedFlavorSegment.get(key);
                    let flavorSegmentValue =
                      flavorSegment && flavorSegment.length > 0
                        ? flavorSegment[0]
                        : {
                          somTY: 0,
                          somPCT: 0,
                        };
                    return (
                      <View
                        style={[
                          styles.box,
                          {alignItems: 'center', borderTopWidth: 2},
                          {borderLeftWidth: index === 0 ? 2 : 1},
                          {
                            borderRightWidth:
                              index === FLAVOR.length - 1 ? 2 : 1,
                          },
                          {borderTopWidth: indexSub === 0 ? 2 : 1},
                          {
                            borderBottomWidth:
                              indexSub === SUB_TYPEC.length - 1 ? 2 : 1,
                          },
                        ]}
                        key={index}
                      >
                        <View style={styles.smallBox}>
                          <Text customStyle="small">
                            {roundDecimal(flavorSegmentValue.somTY)}
                          </Text>
                          <Text customStyle="small">
                            {roundDecimal(flavorSegmentValue.somPCT)}
                          </Text>
                        </View>
                        <View style={styles.bubbleContainer}>
                          <ReactBubbleChart
                            data={formatBubbleChart(
                              groupedBubbleChart.get(key) || [],
                            )}
                            colorLegend={this._colorLegend}
                            fixedDomain={{min: -1, max: 1}}
                            fontSizeFactor={0.3}
                            tooltip
                            tooltipProps={[
                              {css: 'brand', display: 'Brand', prop: '_id'},
                              {css: 'som', display: 'SOM', prop: 'somTY'},
                              {
                                css: 'somPCT',
                                display: 'Delta SOM',
                                prop: 'somPCT',
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>
      );
    }
  }

  _setCompanyFilter(event: Event, value: string) {
    this.setState({
      selectedCompany: value,
    });
  }
  _renderDropdownFilters() {
    let {companyOptions, selectedCompany} = this.state;
    return companyOptions.map((company) => (
      <Dropdown
        key={company}
        label={company}
        selectedValue={selectedCompany}
        onSelect
      />
    ));
  }
}

type VolumeDetailProps = {
  number: number;
  numberDecorator?: string;
  description: string;
  style: StyleSheetTypes;
};

function VolumeDetail(props: VolumeDetailProps) {
  let {number, numberDecorator, description, style} = props;
  let formatedNumber =
    number != null ? roundDecimal(number).toLocaleString() : '-';
  return (
    <View style={[styles.volumeDetailContainer, style]}>
      <Text>
        {formatedNumber} {numberDecorator}
      </Text>
      <Text>{description}</Text>
    </View>
  );
}

type VolumeSummaryProps = {
  data: VolumeGrowth;
};

function VolumeSummary(props: VolumeSummaryProps) {
  let {volume, growth, som, growthSOM} = props.data;
  return (
    <View style={styles.volumeSummaryContainer}>
      <View style={styles.volumeSummaryRow}>
        <VolumeDetail
          number={volume}
          description="Vol YTD (Mio)"
          style={{borderRightWidth: 1, borderBottomWidth: 1}}
        />
        <VolumeDetail
          number={growth}
          numberDecorator="%"
          description="vs YTD LY"
          style={{borderLeftWidth: 1, borderBottomWidth: 1}}
        />
      </View>
      <View style={styles.volumeSummaryRow}>
        <VolumeDetail
          number={som}
          numberDecorator="%"
          description="SOM"
          style={{borderRightWidth: 1, borderTopWidth: 1}}
        />
        <VolumeDetail
          number={growthSOM}
          numberDecorator="%"
          description="SOM Growth"
          style={{borderLeftWidth: 1, borderTopWidth: 1}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  volumeDetailContainer: {
    borderColor: WHITE,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeSummaryContainer: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: WHITE,
    flex: 1,
    backgroundColor: LIGHT_GREY,
  },
  volumeSummaryRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  justifyContent: {
    justifyContent: 'center',
  },
  segmentHeader: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  segmentValue: {
    color: 'white',
    textAlign: 'center',
  },
  smallBox: {
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 4,
    paddingVertical: 1,
    top: 0,
    left: 0,
  },
  box: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    justifyContent: 'center',
  },
  boxSegment: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
  },
  alignJustifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleContainer: {
    paddingBottom: 6,
    maxWidth: 70,
    maxHeight: 70,
  },
  filterContentDropDown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  rightPadding: {
    paddingRight: 15,
  },
});

function mapStateToProps(state: RootState) {
  let {globalFilter, segmentPerformanceState} = state;
  let {selectedTerritory} = globalFilter;
  let {
    bubbleChart,
    flavorSegment,
    volumeGrowth,
    isLoading,
  } = segmentPerformanceState;
  return {
    dataSource: {
      bubbleChartData: bubbleChart,
      flavorSegmentData: flavorSegment,
      volumeGrowthData: volumeGrowth,
    },
    selectedTerritory,
    isLoading: isLoading,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchSegmentPerformanceData() {
      dispatch({type: 'FETCH_SEGMENT_PERFORMANCE_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SegmentPerformanceScene,
);
