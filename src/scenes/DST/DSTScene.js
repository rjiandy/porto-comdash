// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';
import autobind from 'class-autobind';

import {Widget} from '../../general/components/UIComponents';
import {
  View,
  Text,
  LoadingIndicator,
  Dropdown,
  Icon,
} from '../../general/components/coreUIComponents';
import Persist from '../../general/components/Persist';
import {Rectangle} from '../../general/components/shapesComponent';

import KPIAchievementChart from './charts/KPIAchievementChart';
import ConsumerBrandChart from './charts/ConsumerBrandChart';
import ProgramTeamDaysCountSummary from './charts/ProgramTeamDaysCountSummary';
import {CC, ECC} from '../../general/constants/colors';

import type {DST} from './types/DST-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type State = {
  brandList: Array<string>;
  territoryList: Array<string>;
  selectedBrand: string;
  selectedTerritory: string;
};
type Props = {
  title: string;
  data: DST;
  isLoading: boolean;
  selectedTerritory: string;
  fetchDSTData: () => void;
};

export class DSTScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      brandList: [],
      territoryList: [],
      selectedBrand: '',
      selectedTerritory: this.props.selectedTerritory,
    };
  }

  componentWillMount() {
    let {data, fetchDSTData} = this.props;
    if (data.consumerBrand.length === 0) {
      fetchDSTData();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let oldProps = this.props;
    let {selectedBrand} = this.state;
    let {data, selectedTerritory} = nextProps;
    if (
      data.kpiAchievement.length !== oldProps.data.kpiAchievement.length ||
      data.consumerBrand.length !== oldProps.data.consumerBrand.length ||
      oldProps.selectedTerritory !== selectedTerritory
    ) {
      let {consumerBrand, kpiAchievement} = data;
      let filterFn = (data) =>
        !selectedTerritory || data.territory === selectedTerritory;
      let filteredConsumerBrand = consumerBrand.filter(filterFn);
      let filteredKpiAchievement = kpiAchievement.filter(filterFn);
      let brandList = [
        ...new Set([
          ...filteredConsumerBrand.map((data) => data.brand),
          ...filteredKpiAchievement.map((data) => data.brand),
        ]),
      ];
      let territoryList = [
        ...new Set([
          ...consumerBrand.map((data) => data.territory),
          ...kpiAchievement.map((data) => data.territory),
        ]),
      ];
      this.setState({
        brandList,
        territoryList,
        selectedTerritory,
        selectedBrand: brandList.includes(selectedBrand) ? selectedBrand : '',
      });
    }
  }

  render() {
    let {
      brandList,
      territoryList,
      selectedBrand,
      selectedTerritory,
    } = this.state;
    let {title, data, isLoading} = this.props;

    if (isLoading) {
      return (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    }

    let kpiAchievementDataMap = new Map();
    data.kpiAchievement.filter(this._filterTerritoryAndBrand).forEach((datum) => {
      kpiAchievementDataMap.set(datum.kpi, datum);
    });

    let consumerBrand = data.consumerBrand.filter(
      this._filterTerritoryAndBrand,
    );

    return (
      <Widget
        title={title}
        filters={
          <View style={[styles.rowFlexed, styles.filterContainer]}>
            <View style={styles.filterItem}>
              <Dropdown
                label="Territory"
                options={territoryList}
                selectedValue={selectedTerritory}
                onSelect={this._onTerritorySelected}
              />
            </View>

            <View style={styles.filterItem}>
              <Dropdown
                label="Brand"
                options={brandList}
                selectedValue={selectedBrand}
                onSelect={this._onBrandSelected}
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
          name="dstState"
        />
        <View style={styles.rowFlexed}>
          <View style={{flex: 1}}>
            <ProgramTeamDaysCountSummary
              data={kpiAchievementDataMap}
              selectedTerritory={selectedTerritory}
              selectedBrand={selectedBrand}
              isTerritoryIncludedInOptions={
                territoryList.includes(selectedTerritory)
              }
            />
          </View>
          <View style={{flex: 2.4, paddingLeft: 20, paddingTop: 5}}>
            <Text>Main KPI Achievement</Text>
            <KPIAchievementChart
              data={kpiAchievementDataMap}
              selectedTerritory={selectedTerritory}
              selectedBrand={selectedBrand}
              isTerritoryIncludedInOptions={
                territoryList.includes(selectedTerritory)
              }
            />
          </View>
          <View style={{flex: 2.4, position: 'relative', paddingLeft: 30}}>
            <View style={styles.legendContainer}>
              <Text>Consumer Brand</Text>
              <View style={styles.legendItem}>
                <Rectangle size={1.5} backgroundColor={ECC} />
                <Text style={styles.legendText}>ECC</Text>
              </View>
              <View style={styles.legendItem}>
                <Rectangle size={1.5} backgroundColor={CC} />
                <Text style={styles.legendText}>CC</Text>
              </View>
              <View style={styles.legendItem}>
                <Icon
                  name="linear-scale-black"
                  color="black"
                  containerStyle={{alignItems: 'center'}}
                />
                <Text style={styles.legendText}>Strike Rate</Text>
              </View>
            </View>
            <ConsumerBrandChart
              data={consumerBrand}
              selectedTerritory={selectedTerritory}
              selectedBrand={selectedBrand}
              isTerritoryIncludedInOptions={
                territoryList.includes(selectedTerritory)
              }
            />
          </View>
        </View>
      </Widget>
    );
  }

  _onTerritorySelected(selectedTerritory: string) {
    this.setState({
      ...this._updateBrandList(selectedTerritory),
    });
  }

  _onBrandSelected(selectedBrand: string) {
    this.setState({selectedBrand});
  }

  _updateBrandList(territory: string) {
    let {consumerBrand, kpiAchievement} = this.props.data;
    let {selectedBrand} = this.state;
    let filterFn = (data) => data.territory === territory;
    let mapFn = (data) => data.brand;
    let brandList = [
      ...new Set([
        ...consumerBrand.filter(filterFn).map(mapFn),
        ...kpiAchievement.filter(filterFn).map(mapFn),
      ]),
    ];
    return {
      brandList,
      selectedTerritory: territory,
      selectedBrand: brandList.includes(selectedBrand) ? selectedBrand : '',
    };
  }

  _filterTerritoryAndBrand(datum: {territory: string; brand: string}) {
    let {selectedBrand, selectedTerritory} = this.state;
    return (
      datum.territory === selectedTerritory && datum.brand === selectedBrand
    );
  }
}

const styles = StyleSheet.create({
  rowFlexed: {
    flex: 1,
    flexDirection: 'row',
  },
  rightPadding: {
    paddingRight: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  filterItem: {
    marginHorizontal: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendText: {
    paddingHorizontal: 5,
  },
});

function mapStateToProps(state: RootState) {
  let {data, isLoading, error} = state.dstState;
  let {selectedTerritory} = state.globalFilter;
  return {
    data,
    isLoading,
    error,
    selectedTerritory: selectedTerritory || '',
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchDSTData: () => {
      dispatch({
        type: 'FETCH_DST_REQUESTED',
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DSTScene);
