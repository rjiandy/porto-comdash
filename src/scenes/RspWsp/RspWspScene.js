// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';

import RspWspBrand from './RspWspBrand';
import RspWspTerritory from './RspWspTerritory';

import type {CanvasDistributionPrice} from './types/CanvasDistributionPrice-type';
import type {Wsp} from './types/Wsp-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type State = {
  canvasDistPriceData: Array<CanvasDistributionPrice>;
  wspData: Array<Wsp>;
};
type Props = {
  title: string;
  canvasDistributionPrice: Array<CanvasDistributionPrice>;
  wsp: Array<Wsp>;
  isLoading: boolean;
  error: ?Error;
  type: 'brand' | 'territory';
  accessLevel: 'National' | 'Zone' | 'Region' | 'Area';
  selectedTerritory: ?string;
  selectedBrandFamily: ?string;
  fetchRspWsp: () => void;
};

export class RspWspScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    this.state = {
      canvasDistPriceData: [],
      wspData: [],
    };
  }

  componentWillMount() {
    let {canvasDistributionPrice, wsp, fetchRspWsp} = this.props;
    if (wsp.length === 0) {
      fetchRspWsp();
    } else {
      this._initiateFilters(canvasDistributionPrice, wsp);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let {canvasDistributionPrice, wsp} = nextProps;
    this._initiateFilters(canvasDistributionPrice, wsp);
  }

  _initiateFilters(
    canvasDistributionPrice: Array<CanvasDistributionPrice>,
    wsp: Array<Wsp>,
  ) {
    const remove = ['RE', 'TE'];
    const removeFilter = (d) => !remove.includes(d.territory.split(' ')[0]);
    let canvasDistPriceData = canvasDistributionPrice.filter(removeFilter);
    let wspData = wsp.filter(removeFilter);
    this.setState({canvasDistPriceData, wspData});
  }

  render() {
    let {
      title,
      isLoading,
      error,
      type,
      accessLevel,
      selectedTerritory,
      selectedBrandFamily,
    } = this.props;
    let {canvasDistPriceData, wspData} = this.state;
    if (type === 'brand') {
      return (
        <RspWspBrand
          title={title}
          isLoading={isLoading}
          error={error}
          canvasDistributionPrice={canvasDistPriceData}
          wsp={wspData}
          selectedTerritory={selectedTerritory || ''}
          selectedBrandFamily={selectedBrandFamily || ''}
        />
      );
    }
    if (type === 'territory') {
      return (
        <RspWspTerritory
          title={title}
          isLoading={isLoading}
          error={error}
          accessLevel={accessLevel}
          canvasDistributionPrice={canvasDistPriceData}
          wsp={wspData}
          selectedBrandFamily={selectedBrandFamily || ''}
        />
      );
    }
  }
}

function mapStateToProps(state: RootState) {
  let {selectedTerritory, selectedBrandFamily} = state.globalFilter;
  let user = state.currentUser.user;
  let userPosition = 'territory';
  let accessLevel = 'Region';
  if (user) {
    userPosition = user.position.toLowerCase();
    accessLevel = user.userTerritoryLevel;
  }
  return {
    ...state.rspWspState,
    selectedBrandFamily,
    selectedTerritory: userPosition !== 'territory' ? selectedTerritory : '',
    type: userPosition,
    accessLevel,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchRspWsp: () => {
      dispatch({type: 'FETCH_RSP_WSP_REQUESTED'});
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
  RspWspScene,
);
