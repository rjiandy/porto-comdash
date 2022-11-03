// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LoadingIndicator} from '../../general/components/coreUIComponents';
import {Widget} from '../../general/components/UIComponents';

import CompareBrandSomTrend from './CompareBrandSomTrend';
import CompareTerritorySomTrend from './CompareTerritorySomTrend';

import type {SomTrendComparisonData} from './types/SomTrendComparison-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = {
  title: string;
  type: 'brand' | 'territory';
  somTrendComparison: Array<SomTrendComparisonData>;
  selectedTerritory: string;
  selectedBrandFamily: string;
  isLoading: boolean;
  error: ?Error;
  fetchSomTrendComparison: () => void;
};

export class SomTrendComparisonScene extends Component {
  props: Props;

  componentWillMount() {
    let {somTrendComparison, fetchSomTrendComparison} = this.props;
    if (somTrendComparison.length === 0) {
      fetchSomTrendComparison();
    }
  }

  render() {
    let {
      title,
      type,
      somTrendComparison,
      selectedTerritory,
      selectedBrandFamily,
      isLoading,
      error,
    } = this.props;
    if (isLoading) {
      return (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    }
    if (error) {
      // TODO: display something if error != null
    }
    if (type === 'brand') {
      return (
        <CompareBrandSomTrend
          title={title}
          data={somTrendComparison}
          selectedTerritory={selectedTerritory}
          selectedBrandFamily={selectedBrandFamily}
        />
      );
    } else if (type === 'territory') {
      return (
        <CompareTerritorySomTrend title={title} data={somTrendComparison} />
      );
    }
  }
}

export function mapStateToProps(state: RootState) {
  let {somTrendComparison, isLoading, error} = state.somTrendComparisonState;
  let user = state.currentUser.user;
  let userPosition = 'brand';
  if (user) {
    userPosition = user.position.toLowerCase();
  }
  return {
    ...state.globalFilter,
    somTrendComparison,
    isLoading,
    error,
    type: userPosition,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchSomTrendComparison: () => {
      dispatch({type: 'FETCH_SOM_TREND_COMPARISON_REQUESTED'});
    },
  };
}

export function mergeProps(
  stateProps: Object,
  dispatchProps: Object,
  ownProps: Object,
) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  SomTrendComparisonScene,
);
