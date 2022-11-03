// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';

import {
  View,
  Text,
  Dropdown,
  LoadingIndicator,
  ScrollView,
} from '../../general/components/coreUIComponents';

import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import {Rectangle} from '../../general/components/shapesComponent';
import convertObjectValueToNumber from '../../general/helpers/convertObjectValueToNumber';
import formatMonthDesc from '../../general/helpers/formatMonthDesc';
import splitArray from '../../general/helpers/splitArray';
import {TITLE_FONT_SIZE} from '../../general/constants/text';
import {
  PALE_RED,
  DARKER_BLUE,
  SHADOW_GREY,
  LIGHT_GREY,
} from '../../general/constants/colors';
import Persist from '../../general/components/Persist';

import SomPriceTrendChart from './charts/SomPriceTrendChart';
import DLOSSChart from './charts/DLOSSChart';

import type {DistributionPerformanceSom} from './types/DistributionPerformanceSom-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = {
  title: string;
  data: DistributionPerformanceSom;
  isLoading: boolean;
  selectedTerritory: string;
  selectedBrandFamily: string;
  fetchDistributionPerformanceSOMData: () => void;
};

type State = {
  selectedProduct: Array<string>;
  productList: Array<string>;
  territoryList: Array<string>;
  selectedTerritory: string;
};

export const MAX_SELECTED_PRODUCTS_DESKTOP = 4;
export const MAX_SELECTED_PRODUCTS_IPAD = 3;

class DistributionPerformanceSOM extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);

    this.state = {
      selectedProduct: [],
      productList: [],
      territoryList: [],
      selectedTerritory: this.props.selectedTerritory,
    };
  }

  componentWillMount() {
    let {
      data,
      selectedTerritory,
      selectedBrandFamily,
      fetchDistributionPerformanceSOMData,
    } = this.props;
    if (data.length === 0) {
      fetchDistributionPerformanceSOMData();
    } else {
      let territoryList = [...new Set(data.map((datum) => datum.territory))];

      this.setState({
        productList: this._getProductListBasedOnTerritory(
          selectedTerritory,
          selectedBrandFamily,
          data,
        ),
        selectedProduct: [],
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
      selectedTerritory !== oldProps.selectedTerritory
    ) {
      let newState = {};
      if (oldProps.selectedBrandFamily !== newProps.selectedBrandFamily) {
        newState = {
          selectedProduct: [],
        };
      }

      let territoryList = [...new Set(data.map((datum) => datum.territory))];

      this.setState({
        ...newState,
        productList: this._getProductListBasedOnTerritory(
          newProps.selectedTerritory,
          newProps.selectedBrandFamily,
          newProps.data,
        ),
        territoryList,
        selectedTerritory: newProps.selectedTerritory,
      });
    }
  }

  render() {
    let {title, data, isLoading, selectedBrandFamily} = this.props;
    let {
      selectedProduct,
      productList,
      selectedTerritory,
      territoryList,
    } = this.state;

    if (isLoading) {
      return (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    }

    let content = [];
    if (!selectedTerritory) {
      content = <PlaceholderView text="Please select territory first" />;
    } else if (territoryList.indexOf(selectedTerritory) < 0) {
      content = (
        <PlaceholderView text={`No data for territory ${selectedTerritory}`} />
      );
    } else if (selectedProduct.length < 1) {
      content = <PlaceholderView text="Please select product first" />;
    } else {
      let filteredData: DistributionPerformanceSom = [];
      for (let product of selectedProduct) {
        for (let datum of data) {
          if (
            datum.territory === selectedTerritory &&
            datum.product === product
          ) {
            let monthDesc = formatMonthDesc(datum.monthDesc);
            filteredData.push({
              ...convertObjectValueToNumber(datum, [
                'som',
                'pricePerPack',
                'wdl',
                'woos',
                'monthID',
              ]),
              monthDesc,
            });
          }
        }
      }

      let productMap = new Map();

      filteredData.forEach((datum) => {
        let somDataArray = productMap.get(datum.product);
        if (somDataArray && Array.isArray(somDataArray)) {
          somDataArray.push(datum);
          somDataArray.sort((a, b) => Number(a.monthID) - Number(b.monthID));
          productMap.set(datum.product, somDataArray);
        } else {
          productMap.set(datum.product, [datum]);
        }
      });

      let splittedProduct = splitArray(
        Array.from(productMap.values()),
        MAX_SELECTED_PRODUCTS_IPAD,
      );
      let charts = [];

      splittedProduct.forEach((product) => {
        let splittedProductMap = new Map(
          product.map((datum) => [datum[0].product, datum]),
        );
        charts.push(
          <View style={styles.section}>
            <View style={styles.chartSegment}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.title}>SOM & Price Trend</Text>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <Rectangle size={1.5} backgroundColor={PALE_RED} />
                    <Text style={{paddingLeft: 5}}>Price Per Pack</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <Rectangle size={1.5} backgroundColor={DARKER_BLUE} />
                    <Text style={{paddingLeft: 5}}>SOM</Text>
                  </View>
                </View>
              </View>

              <SomPriceTrendChart
                key={`SomPriceTrendChart${selectedProduct.length}`}
                data={splittedProductMap}
                maxSelectedProduct={MAX_SELECTED_PRODUCTS_IPAD}
              />
            </View>
            <View style={styles.chartSegment}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.title}>DL & OOS</Text>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <Rectangle size={1.5} backgroundColor={SHADOW_GREY} />
                    <Text style={{paddingLeft: 5}}>DL</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <Rectangle size={1.5} backgroundColor={PALE_RED} />
                    <Text style={{paddingLeft: 5}}>OOS</Text>
                  </View>
                </View>
              </View>
              <DLOSSChart
                key={`DLOSSChart${selectedProduct.length}`}
                data={splittedProductMap}
                maxSelectedProduct={MAX_SELECTED_PRODUCTS_IPAD}
              />
            </View>
          </View>,
        );
      });

      content = <ScrollView>{charts}</ScrollView>;
    }

    let widgetTitle = title;
    if (selectedBrandFamily) {
      widgetTitle = `${widgetTitle} (Brand Family: ${selectedBrandFamily})`;
    }

    return (
      <Widget
        title={widgetTitle}
        filters={
          <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <Dropdown
                label="Territory"
                onSelect={(selectedTerritory) =>
                  this.setState({
                    productList: this._getProductListBasedOnTerritory(
                      selectedTerritory,
                      this.props.selectedBrandFamily,
                      data,
                    ),
                    selectedTerritory,
                  })}
                selectedValue={selectedTerritory}
                options={territoryList}
              />
            </View>
            <View style={styles.filterItem}>
              <Dropdown
                label="Product"
                onSelect={this._onProductSelected}
                selectedValue={selectedProduct}
                options={productList}
                multiple
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
          name="DistributionPerfSOMState"
        />
        {content}
      </Widget>
    );
  }

  _getProductListBasedOnTerritory(
    selectedTerritory: string,
    selectedBrandFamily: ?string,
    data: DistributionPerformanceSom,
  ) {
    let productList = new Set();
    data.forEach((datum) => {
      if (selectedBrandFamily) {
        if (
          selectedBrandFamily === datum.brandFamily &&
          datum.territory === selectedTerritory
        ) {
          productList.add(datum.product);
        }
      } else {
        if (datum.territory === selectedTerritory) {
          productList.add(datum.product);
        }
      }
    });

    return Array.from(productList.values());
  }

  _onProductSelected(newSelectedProduct) {
    this.setState({selectedProduct: [...newSelectedProduct]});
  }
}

const styles = StyleSheet.create({
  chartSegment: {
    paddingVertical: 5,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    marginBottom: 5,
  },
  filterContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 20,
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  noData: {
    flex: 1,
    backgroundColor: LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterItem: {
    marginHorizontal: 5,
  },
  filterLabel: {
    color: 'rgb(187, 187, 187)',
    fontSize: 11,
    fontFamily: 'SanFransiscoText',
    transform: [{scale: 0.75}, {translateY: -5}],
  },
});

function mapStateToProps(state: RootState) {
  let {distributionPerformanceSomState: {data, isLoading, error}} = state;
  let {selectedTerritory, selectedBrandFamily} = state.globalFilter;
  return {
    data,
    isLoading,
    error,
    selectedBrandFamily,
    selectedTerritory,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchDistributionPerformanceSOMData: () => {
      dispatch({type: 'FETCH_DISTRIBUTION_PERFORMANCE_SOM_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DistributionPerformanceSOM,
);
