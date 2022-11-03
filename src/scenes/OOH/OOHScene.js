// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';
import autobind from 'class-autobind';
import Header from './components/Header';
import Detail from './components/Detail';

import {
  View,
  Dropdown,
  LoadingIndicator,
} from '../../general/components/coreUIComponents';
import {Widget} from '../../general/components/UIComponents';
import Persist from '../../general/components/Persist';
import convertObjectValueToNumber from '../../general/helpers/convertObjectValueToNumber';
import {LIGHT_GREY} from '../../general/constants/colors';

import type {OOHData, OOHDetailData} from './type/OOH-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = {
  title: string;
  data: {ooh: OOHData; oohDetail: OOHDetailData};
  isLoading: boolean;
  error: ?Error;
  selectedTerritory: string;
  fetchOOHData: () => void;
};

type State = {
  selectedType: string;
  territoryList: Array<string>;
  selectedTerritory: string;
  typeList: Array<string>;
};

export class OOHScene extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedType: 'All',
      typeList: [],
      territoryList: [],
      selectedTerritory: this.props.selectedTerritory,
    };
  }

  componentWillMount() {
    let {data, fetchOOHData} = this.props;
    let {selectedTerritory, selectedType} = this.state;
    if (data.ooh.length === 0 || data.oohDetail.length === 0) {
      fetchOOHData();
    } else {
      let newTypeList = this._getItemTypeList(data, selectedTerritory);
      let newSelectedType = selectedType;
      if (!newTypeList.includes(selectedType)) {
        newSelectedType = '';
      }
      this.setState({
        selectedType: newSelectedType,
        typeList: newTypeList,
        territoryList: this._getTerritoryList(data),
      });
    }
  }

  componentWillReceiveProps(newProps: Props) {
    let oldProps = this.props;
    if (
      oldProps.data.ooh.length !== newProps.data.ooh.length ||
      oldProps.data.oohDetail.length !== newProps.data.oohDetail.length ||
      oldProps.selectedTerritory !== newProps.selectedTerritory
    ) {
      let {data, selectedTerritory} = newProps;
      let {selectedType} = this.state;
      let newTypeList = this._getItemTypeList(data, selectedTerritory);
      let newSelectedType = selectedType;
      if (!newTypeList.includes(selectedType)) {
        newSelectedType = '';
      }
      this.setState({
        selectedType: newSelectedType,
        typeList: newTypeList,
        territoryList: this._getTerritoryList(data),
        selectedTerritory,
      });
    }
  }

  _getTerritoryList(data: {ooh: OOHData; oohDetail: OOHDetailData}) {
    return [
      ...new Set([
        ...data.ooh.map((datum) => datum.territory),
        ...data.oohDetail.map((datum) => datum.territory),
      ]),
    ];
  }

  render() {
    let {data: {ooh, oohDetail}, isLoading, title} = this.props;
    let {selectedTerritory, selectedType} = this.state;
    if (isLoading) {
      return (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    }

    let convertedOOHData = ooh.map((data) =>
      convertObjectValueToNumber(data, [
        'billboard',
        'baliho',
        'minibillboard',
        'streetsignage',
        'others',
      ]),
    );
    let convertedOOHDetailData = oohDetail.map((data) =>
      convertObjectValueToNumber(data, ['measure']),
    );

    let oohFilteredData = convertedOOHData.filter(
      (datum) => datum.territory === selectedTerritory,
    );

    let oohDetailFilteredData = convertedOOHDetailData.filter(
      (datum) => datum.territory === selectedTerritory,
    );

    return (
      <Widget title={title} filters={this._renderFilter()}>
        <Persist
          name="oohSceneState"
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
              let newTypeList = this._getItemTypeList(
                this.props.data,
                selectedTerritory,
              );
              let newSelectedType = selectedType;
              if (!newTypeList.includes(selectedType)) {
                newSelectedType = '';
              }
              this.setState({
                typeList: newTypeList,
                selectedType: newSelectedType,
                selectedTerritory,
              });
            } else {
              let newTerritoryList = state.territoryList;
              if (
                state.territoryList.length === 0 &&
                (this.props.data.ooh.length !== 0 ||
                  this.props.data.oohDetail.length !== 0)
              ) {
                newTerritoryList = this._getTerritoryList(this.props.data);
              }
              this.setState({
                ...state,
                territoryList: newTerritoryList,
              });
            }
          }}
        />
        <View style={{flex: 1}}>
          <Header
            data={oohFilteredData[0]}
            selectedTerritory={selectedTerritory}
          />
          <Detail
            data={oohDetailFilteredData}
            selectedTerritory={selectedTerritory}
            selectedType={selectedType}
          />
        </View>
      </Widget>
    );
  }

  _renderFilter() {
    let {selectedType, typeList, selectedTerritory, territoryList} = this.state;
    return (
      <View style={styles.filterContainer}>
        <View style={styles.rightPadding}>
          <Dropdown
            label="Territory"
            selectedValue={selectedTerritory}
            onSelect={(selectedTerritory) => {
              let newTypeList = this._getItemTypeList(
                this.props.data,
                selectedTerritory,
              );
              let newSelectedType = selectedType;
              if (!newTypeList.includes(selectedType)) {
                newSelectedType = '';
              }
              this.setState({
                selectedTerritory,
                selectedType: newSelectedType,
                typeList: newTypeList,
              });
            }}
            options={territoryList}
          />
        </View>
        <Dropdown
          label="OOH Type"
          selectedValue={selectedType}
          onSelect={(selectedType) => this.setState({selectedType})}
          options={typeList}
        />
      </View>
    );
  }

  _getItemTypeList(
    data: {ooh: OOHData; oohDetail: OOHDetailData},
    selectedTerritory: string,
  ) {
    let {oohDetail} = data;
    return [
      ...new Set(
        oohDetail
          .filter((datum) => datum.territory === selectedTerritory)
          .map((datum) => datum.oohType),
      ),
    ];
  }
}

function mapStateToProps(state: RootState) {
  let {oohState, globalFilter} = state;
  let {selectedTerritory} = globalFilter;
  return {
    ...oohState,
    selectedTerritory,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchOOHData: () => {
      dispatch({
        type: 'FETCH_OOH_REQUESTED',
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OOHScene);

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  rightPadding: {
    paddingRight: 15,
  },
  noDataAvailable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GREY,
  },
});
