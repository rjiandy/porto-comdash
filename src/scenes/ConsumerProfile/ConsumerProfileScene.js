// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';
import autobind from 'class-autobind';

import {
  View,
  Text,
  Dropdown,
  LoadingIndicator,
} from '../../general/components/coreUIComponents';
import {Widget} from '../../general/components/UIComponents';
import ConsumerProfileStackedBarChart from './charts/ConsumerProfileStackedBarChart';
import Persist from '../../general/components/Persist';

import type {ConsumerProfile} from './types/ConsumerProfile-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type State = {
  selectedProducts: Array<string>;
  productList: Array<string>;
  territoryList: Array<string>;
  selectedTerritory: string;
  consumerProfileData: Array<ConsumerProfile>;
};
type Props = {
  title: string;
  selectedTerritory: string;
  consumerProfile: ConsumerProfile;
  isLoading: boolean;
  error: ?Error;
  fetchConsumerProfile: () => void;
};

const PROFILE_AGE = 'AGE';
const PROFILE_SES = 'SES';

export class ConsumerProfileScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedProducts: [],
      productList: [],
      consumerProfileData: [],
      territoryList: [],
      selectedTerritory: this.props.selectedTerritory,
    };
  }

  componentWillMount() {
    let {consumerProfile, selectedTerritory} = this.props;
    if (consumerProfile.length === 0) {
      this.props.fetchConsumerProfile();
    } else {
      this.setState({
        ...this._filterProductList(selectedTerritory, consumerProfile),
        territoryList: this._getTerritoryList(consumerProfile),
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let oldProps = this.props;
    let {selectedTerritory, consumerProfile} = nextProps;
    if (
      oldProps.consumerProfile.length !== consumerProfile.length ||
      oldProps.selectedTerritory !== selectedTerritory
    ) {
      this.setState({
        ...this._filterProductList(selectedTerritory, consumerProfile),
        territoryList: this._getTerritoryList(consumerProfile),
        selectedTerritory,
      });
    }
  }

  _getTerritoryList(data: ConsumerProfile) {
    return [...new Set(data.map((datum) => datum.territory))];
  }

  _filterProductList(
    territory: string,
    consumerProfileProp?: ?ConsumerProfile,
    selectedProducts?: Array<string>,
  ) {
    let {consumerProfile} = this.props;
    let oldSelectedProducts = selectedProducts || this.state.selectedProducts;
    let data = consumerProfileProp || consumerProfile;
    let productSet = new Set();
    data
      .filter((datum) => datum.territory === territory)
      .forEach((datum) => productSet.add(datum.product));
    let productList = Array.from(productSet);
    let newSelectedProducts = oldSelectedProducts.filter((product) => {
      return productList.indexOf(product) > -1;
    });
    this._onProductSelected(
      newSelectedProducts,
      territory,
      consumerProfileProp,
    );
    return {
      productList,
    };
  }

  _filterData(
    territory: string,
    products: Array<string>,
    consumerProfileProp?: ?ConsumerProfile,
  ) {
    let {consumerProfile} = this.props;
    let data = consumerProfileProp || consumerProfile;
    let consumerProfileMap = new Map();
    let filtered = data.filter(
      (datum) =>
        datum.territory === territory && products.includes(datum.product),
    );
    products.forEach((product) => {
      let consumerProfileForProduct = filtered.filter(
        (datum) => datum.product === product,
      );
      consumerProfileMap.set(product, consumerProfileForProduct);
    });
    return {
      consumerProfileData: Array.from(consumerProfileMap.values()),
    };
  }

  _onProductSelected(
    selectedProducts: Array<string>,
    selectedTerritory?: string,
    consumerProfileProp?: ?ConsumerProfile,
  ) {
    if (selectedProducts.length <= 5) {
      this.setState({
        selectedProducts,
        ...this._filterData(
          selectedTerritory || this.state.selectedTerritory,
          selectedProducts,
          consumerProfileProp,
        ),
      });
    } else {
      // TODO: display some warning / error here
    }
  }

  _onTerritorySelected(selectedTerritory: string) {
    this.setState({
      selectedTerritory,
      ...this._filterProductList(selectedTerritory),
    });
  }

  render() {
    let {
      selectedProducts,
      productList,
      consumerProfileData,
      selectedTerritory,
      territoryList,
    } = this.state;
    let {title, isLoading, error} = this.props;
    let content;
    if (isLoading) {
      content = (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    } else if (error != null) {
      // TODO: display something when error != null
    } else {
      let ageData = [];
      let sesData = [];
      for (let data of consumerProfileData) {
        let profileAge = data.filter((datum) => datum.itemType === PROFILE_AGE);
        if (profileAge.length > 0) {
          ageData.push(profileAge);
        }
        let profileSes = data.filter((datum) => datum.itemType === PROFILE_SES);
        if (profileSes.length > 0) {
          sesData.push(profileSes);
        }
      }
      content = (
        <View style={[styles.flex, styles.rowFlexed]}>
          <View style={styles.flex}>
            <Text fontWeight="bold" style={styles.centerText}>
              Age Profile Comparison
            </Text>
            <ConsumerProfileStackedBarChart data={ageData} />
          </View>
          <View style={styles.rightPadding} />
          <View style={styles.flex}>
            <Text fontWeight="bold" style={styles.centerText}>
              SES Profile Comparison
            </Text>
            <ConsumerProfileStackedBarChart data={sesData} />
          </View>
        </View>
      );
    }
    return (
      <Widget
        title={title}
        filters={
          <View style={[styles.rowFlexed, styles.filterContainer]}>
            <View style={styles.filterItem}>
              <Dropdown
                label="Territory"
                selectedValue={selectedTerritory}
                onSelect={this._onTerritorySelected}
                options={territoryList}
              />
            </View>
            <Dropdown
              label="Product"
              selectedValue={selectedProducts}
              onSelect={this._onProductSelected}
              options={productList}
              multiple
            />
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
            let {selectedProducts} = state;
            if (
              selectedTerritory !== oldProps.selectedTerritory &&
              selectedTerritory !== state.selectedTerritory
            ) {
              this.setState({
                ...this._filterProductList(
                  selectedTerritory,
                  null,
                  selectedProducts,
                ),
                selectedTerritory,
              });
            } else {
              this.setState(state);
            }
          }}
          name="ConsumerProfileState"
        />
        {content}
      </Widget>
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
  filterItem: {
    paddingRight: 10,
  },
  filterContainer: {
    paddingBottom: 20,
  },
  rightPadding: {
    paddingRight: 15,
  },
  bottomMargin: {
    marginBottom: 20,
  },
  centerText: {
    textAlign: 'center',
  },
});

function mapStateToProps(state: RootState) {
  let {consumerProfileState, globalFilter} = state;
  let {selectedTerritory} = globalFilter;
  return {
    ...consumerProfileState,
    selectedTerritory,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchConsumerProfile: () => {
      dispatch({type: 'FETCH_CONSUMER_PROFILE_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ConsumerProfileScene,
);
