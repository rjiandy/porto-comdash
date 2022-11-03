// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';

import {
  View,
  LoadingIndicator,
  ErrorComponent,
  Dropdown,
} from '../../general/components/coreUIComponents';
import {
  Widget,
  // GlobalFilterPlaceholder,
  // Dropdown,
} from '../../general/components/UIComponents';
import Persist from '../../general/components/Persist';

import convertObjectValueToNumber from '../../general/helpers/convertObjectValueToNumber';
import FlavorSegmentTrend from './charts/FlavorSegmentTrend';
import PriceSegmentTrend from './charts/PriceSegmentTrend';
import IndustrySizeChart from './charts/IndustrySizeChart';
import formatMonthDesc from '../../general/helpers/formatMonthDesc';

import type {IndustryUpdateState} from './types/IndustryUpdate-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = IndustryUpdateState & {
  title: string;
  selectedTerritory: string;
  fetchIndustryUpdate: () => void;
};

type State = {
  selectedTerritory: string;
  territoryOptions: Array<string>;
};

export class IndustryUpdateScene extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedTerritory: '',
      territoryOptions: [],
    };
  }

  componentWillMount() {
    let {flavorSegmentTrend, fetchIndustryUpdate} = this.props;
    if (flavorSegmentTrend.length === 0) {
      fetchIndustryUpdate();
    }
    this.setState({
      selectedTerritory: this.props.selectedTerritory,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.flavorSegmentTrend.length !==
      this.props.flavorSegmentTrend.length
    ) {
      let territoryOptions = Array.from(
        new Set(
          [
            ...nextProps.flavorSegmentTrend.map(
              ({territory, sortOrderTerritory}) => ({
                territory,
                sortOrderTerritory,
              }),
            ),
            ...nextProps.priceSegmentTrend.map(
              ({territory, sortOrderTerritory}) => ({
                territory,
                sortOrderTerritory,
              }),
            ),
            ...nextProps.industrySize.map(
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
        territoryOptions,
      });
    }
  }

  render() {
    let {
      title,
      flavorSegmentTrend,
      priceSegmentTrend,
      industrySize,
      isLoading,
      error,
    } = this.props;
    let {selectedTerritory} = this.state;
    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      content = (
        <ErrorComponent
          url="/IndustryUpdateData"
          errorMessage={error.message}
        />
      );
    } else {
      let flavorSegmentMap = new Map();
      flavorSegmentTrend
        .filter(
          (data) =>
            data.flavorSegment &&
            data.territory === selectedTerritory &&
            data.flavorSegment.toUpperCase() !== 'NULL',
        )
        .map((data) => {
          let monthDesc = formatMonthDesc(data.monthDesc);
          return {
            ...convertObjectValueToNumber(data, ['som', 'timeMonthID']),
            monthDesc,
          };
        })
        .forEach((data) => {
          let flavorArray = flavorSegmentMap.get(data.flavorSegment);
          if (flavorArray && Array.isArray(flavorArray)) {
            flavorArray.push(data);
            flavorArray.sort(
              (a, b) => Number(a.timeMonthID) - Number(b.timeMonthID),
            );
            flavorSegmentMap.set(data.flavorSegment, flavorArray);
          } else {
            flavorSegmentMap.set(data.flavorSegment, [data]);
          }
        });

      let flavorSegmentData = Array.from(flavorSegmentMap.values());

      let priceSegmentMap = new Map();
      priceSegmentTrend
        .filter(
          (data) =>
            data.priceSegment &&
            data.territory === selectedTerritory &&
            data.priceSegment.toUpperCase() !== 'NULL',
        )
        .map((data) => {
          let monthDesc = formatMonthDesc(data.monthDesc);
          return {
            ...convertObjectValueToNumber(data, ['som', 'timeMonthID']),
            monthDesc,
          };
        })
        .forEach((data) => {
          let priceArray = priceSegmentMap.get(data.priceSegment);
          if (priceArray && Array.isArray(priceArray)) {
            priceArray.push(data);
            priceArray.sort(
              (a, b) => Number(a.timeMonthID) - Number(b.timeMonthID),
            );
            priceSegmentMap.set(data.priceSegment, priceArray);
          } else {
            priceSegmentMap.set(data.priceSegment, [data]);
          }
        });

      let priceSegmentData = Array.from(priceSegmentMap.values());

      let industrySizeData = industrySize
        .filter((datum) => datum.territory === selectedTerritory)
        .map((datum) => convertObjectValueToNumber(datum, ['volume']));
      content = (
        <View style={{flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <IndustrySizeChart
                data={industrySizeData}
                showPlaceholder={!selectedTerritory}
              />
            </View>
            <View style={{flex: 1}}>
              <FlavorSegmentTrend
                data={flavorSegmentData}
                showPlaceholder={!selectedTerritory}
              />
              <View style={{marginBottom: 10}} />
              <PriceSegmentTrend
                data={priceSegmentData}
                showPlaceholder={!selectedTerritory}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <Widget
        title={title}
        filters={
          <View>
            <Dropdown
              label="Territory"
              selectedValue={this.state.selectedTerritory}
              onSelect={(value) => this.setState({selectedTerritory: value})}
              options={this.state.territoryOptions}
            />

            {/* <GlobalFilterPlaceholder
              label="Territory"
              value={selectedTerritory}
            /> */}
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
          name="industryUpdateState"
        />
        {content}
      </Widget>
    );
  }
}

export function mapStateToProps(state: RootState) {
  let {
    flavorSegmentTrend,
    priceSegmentTrend,
    industrySize,
    isLoading,
    error,
  } = state.industryUpdateState;
  let {selectedTerritory} = state.globalFilter;
  return {
    flavorSegmentTrend,
    priceSegmentTrend,
    industrySize,
    isLoading,
    error,
    selectedTerritory,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchIndustryUpdate: () => {
      dispatch({type: 'FETCH_INDUSTRY_UPDATE_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  IndustryUpdateScene,
);
