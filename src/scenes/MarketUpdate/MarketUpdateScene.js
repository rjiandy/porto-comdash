// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';

import {
  View,
  LoadingIndicator,
  ErrorComponent,
  Dropdown,
} from '../../general/components/coreUIComponents';
import {Widget} from '../../general/components/UIComponents';
import {LIGHT_GREY} from '../../general/constants/colors';

import Persist from '../../general/components/Persist';
import convertObjectValueToNumber from '../../general/helpers/convertObjectValueToNumber';
import BrandPerformanceChart from './charts/BrandPerformanceChart';
import CompanyPerformanceChart from './charts/CompanyPerformanceChart';
import SOMGrowthDataTable from './charts/SOMGrowthDataTable';
import TopTenChart from './charts/TopTenChart';
import TopGainerChart from './charts/TopGainerChart';
import TopLoserChart from './charts/TopLoserChart';
import formatMonthDesc from '../../general/helpers/formatMonthDesc';

import type {MarketUpdateState} from './types/MarketUpdate-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = MarketUpdateState & {
  title: string;
  fetchMarketUpdate: () => void;
  selectedTerritory: string;
  selectedBrandFamily: string;
  access: 'territory' | 'brand';
};

type State = {
  selectedTerritory: string;
  selectedProduct: string;
  territoryList: Array<string>;
  productList: Array<string>;
};

export class MarketUpdateScene extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    this.state = {
      selectedTerritory: '',
      selectedProduct: '',
      territoryList: [],
      productList: [],
    };
    autobind(this);
  }

  componentWillMount() {
    let {
      brandPerformance,
      fetchMarketUpdate,
      selectedTerritory,
      selectedBrandFamily,
    } = this.props;
    if (brandPerformance.length === 0) {
      fetchMarketUpdate();
    } else {
      this._initiateFilters(this.props, selectedTerritory, selectedBrandFamily);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let oldProps = this.props;
    let {brandPerformance, selectedTerritory, selectedBrandFamily} = nextProps;
    if (brandPerformance.length !== oldProps.brandPerformance.length) {
      this._initiateFilters(nextProps, selectedTerritory, selectedBrandFamily);
    }
    if (
      oldProps.selectedTerritory !== selectedTerritory &&
      this.state.selectedTerritory !== selectedTerritory
    ) {
      let {selectedProduct} = this.state;
      this._initiateFilters(nextProps, selectedTerritory, selectedProduct);
    }
    if (
      oldProps.selectedBrandFamily !== selectedBrandFamily &&
      this.state.selectedProduct !== selectedBrandFamily
    ) {
      let {selectedTerritory} = this.state;
      this._initiateFilters(nextProps, selectedTerritory, selectedBrandFamily);
    }
  }

  _initiateFilters(
    data: Props,
    selectedTerritory: string,
    selectedBrandFamily: string,
  ) {
    let {
      brandPerformance,
      companyPerformance,
      industrySizeGainLose,
      topRightChart,
    } = data;
    let sortTerritory = (a, b) => a.sortOrderTerritory - b.sortOrderTerritory;
    let territorySet = new Set([
      ...brandPerformance.sort(sortTerritory).map(({territory}) => territory),
      ...companyPerformance.sort(sortTerritory).map(({territory}) => territory),
      ...industrySizeGainLose
        .sort(sortTerritory)
        .map(({territory}) => territory),
      ...topRightChart.sort(sortTerritory).map(({territory}) => territory),
    ]);

    let sortBrandFamily = (a, b) =>
      a.sortOrderBrandFamily - b.sortOrderBrandFamily;
    let brandFamilySet = new Set([
      ...topRightChart
        .sort(sortBrandFamily)
        .map(({brandFamily}) => brandFamily),
    ]);
    this.setState({
      territoryList: [...territorySet],
      productList: [...brandFamilySet],
      selectedTerritory,
      selectedProduct: selectedBrandFamily,
    });
  }

  render() {
    let {
      title,
      brandPerformance,
      companyPerformance,
      topRightChart,
      industrySizeGainLose,
      isLoading,
      error,
      access,
    } = this.props;
    let {
      territoryList,
      productList,
      selectedTerritory,
      selectedProduct,
    } = this.state;
    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      content = (
        <ErrorComponent url="/MarketUpdateData" errorMessage={error.message} />
      );
    } else {
      let companyPerformanceData = companyPerformance
        .filter((datum) => datum.territory === selectedTerritory)
        .map((datum) => convertObjectValueToNumber(datum, ['som', 'somGrowth']));
      let tableChartData = topRightChart
        .filter(
          (datum) =>
            datum.territory === selectedTerritory &&
            (selectedProduct
              ? datum.brandFamily === selectedProduct
              : datum.brandFamily != null),
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((datum) =>
          convertObjectValueToNumber(datum, [
            'somYtd',
            'somGrowth',
            'somLastTwoMonth',
            'somLastMonth',
            'somThisMonth',
          ]),
        );
      let filtered = industrySizeGainLose
        .filter((datum) => datum.territory === selectedTerritory)
        .map((datum) =>
          convertObjectValueToNumber(datum, [
            'ytdBrandSom',
            'ytdBrandGainerSom',
            'ytdBrandLoserSom',
          ]),
        );
      let topTen = [];
      let topGainer = [];
      let topLoser = [];
      for (let data of filtered) {
        let brand = {
          order: data.ytdOrder,
          brand: data.ytdBrand,
          som: data.ytdBrandSom,
          somGrowth: data.ytdBrandGrowth,
        };
        topTen = [...topTen, brand];
        let gainer = {brand: data.ytdBrandGainer, som: data.ytdBrandGainerSom};
        topGainer = [...topGainer, gainer];
        let loser = {brand: data.ytdBrandLoser, som: data.ytdBrandLoserSom};
        topLoser = [...topLoser, loser];
      }
      topTen.sort((prev, next) => next.order - prev.order);
      topGainer.sort((prev, next) => prev.som - next.som);
      topLoser = topLoser.sort((prev, next) => prev.som - next.som);

      let brandPerformanceMap = new Map();
      let monthList = new Map();
      brandPerformance
        .filter((data) => data.territory === selectedTerritory)
        .filter((data) => data.brandFamily === selectedProduct)
        .map((data) => {
          let monthDesc = formatMonthDesc(data.monthDesc);
          return {
            ...convertObjectValueToNumber(data, ['som']),
            monthDesc,
          };
        })
        .forEach((data) => {
          let brand = brandPerformanceMap.get(data.product);
          if (brand && Array.isArray(brand)) {
            let newArray = brand;
            newArray.push(data);
            brandPerformanceMap.set(data.product, newArray);
          } else {
            brandPerformanceMap.set(data.product, [data]);
          }

          if (!monthList.has(data.monthDesc)) {
            monthList.set(data.monthDesc, data.monthId);
          }
        });

      let brandPerformanceData = Array.from(
        brandPerformanceMap.values(),
      ).map((data) => {
        let newData = [];
        for (let [monthDesc, monthId] of monthList) {
          let existedMonth = data.filter(
            (datum) => datum.monthDesc === monthDesc,
          );
          if (existedMonth.length < 1) {
            newData.push({
              ...data[0],
              monthDesc,
              monthId,
              som: null,
            });
          }
        }
        return [...data, ...newData].sort(
          (a, b) => Number(a.monthId) - Number(b.monthId),
        );
      });
      content = (
        <View style={{flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1.3}}>
              {access === 'territory' && selectedProduct === 'HMS' ? (
                <CompanyPerformanceChart
                  data={companyPerformanceData}
                  selectedTerritory={selectedTerritory || ''}
                />
              ) : (
                <BrandPerformanceChart
                  data={brandPerformanceData}
                  selectedBrand={selectedProduct || ''}
                />
              )}
            </View>
            <View style={{flex: 1, paddingBottom: 20}}>
              <SOMGrowthDataTable
                data={tableChartData}
                selectedBrand={selectedProduct || ''}
              />
            </View>
          </View>
          <View style={styles.itemChartContainer}>
            <View style={styles.itemChart}>
              <TopTenChart
                data={topTen}
                selectedTerritory={selectedTerritory || ''}
              />
            </View>
            <View style={[styles.itemChart, {marginHorizontal: 5}]}>
              <TopGainerChart
                data={topGainer}
                selectedTerritory={selectedTerritory || ''}
              />
            </View>
            <View style={styles.itemChart}>
              <TopLoserChart
                data={topLoser}
                selectedTerritory={selectedTerritory || ''}
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
          <View style={styles.filterContainer}>
            <View style={styles.rightPadding}>
              <Dropdown
                label="Territory"
                options={territoryList}
                selectedValue={selectedTerritory}
                onSelect={(selectedTerritory) =>
                  this.setState({selectedTerritory})}
                disabled={territoryList.length === 0}
              />
            </View>
            <Dropdown
              label="Product"
              options={productList}
              selectedValue={selectedProduct}
              onSelect={(selectedProduct) => this.setState({selectedProduct})}
              disabled={productList.length === 0}
            />
          </View>
        }
      >
        <Persist
          name="Market Update Territory"
          data={{
            state: this.state,
            oldProps: {
              selectedTerritory: this.props.selectedTerritory,
              selectedBrandFamily: this.props.selectedBrandFamily,
            },
          }}
          onMount={({state, oldProps}) => {
            let {selectedTerritory, selectedBrandFamily} = this.props;
            let newState = {...state};
            if (
              selectedTerritory !== oldProps.selectedTerritory &&
              selectedTerritory !== state.selectedTerritory
            ) {
              newState.selectedTerritory = selectedTerritory;
            }

            if (
              selectedBrandFamily !== oldProps.selectedBrandFamily &&
              selectedBrandFamily !== state.selectedProduct
            ) {
              newState.selectedProduct = selectedBrandFamily;
            }

            this._initiateFilters(
              this.props,
              newState.selectedTerritory,
              newState.selectedProduct,
            );
          }}
        />
        {content}
      </Widget>
    );
  }
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  filterItem: {
    marginHorizontal: 10,
  },
  rightPadding: {
    paddingRight: 15,
  },
  itemChart: {
    flex: 1,
    borderRadius: 5,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
  },
  itemChartContainer: {
    flex: 1.3,
    flexDirection: 'row',
    paddingTop: 10,
  },
  filterItemTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function mapStateToProps(state: RootState) {
  let {marketUpdateState, globalFilter, currentUser} = state;
  let {user} = currentUser;
  let userPosition = 'territory';
  if (user) {
    userPosition = user.position.toLowerCase();
  }
  return {
    ...globalFilter,
    ...marketUpdateState,
    access: userPosition,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchMarketUpdate: () => {
      dispatch({type: 'FETCH_MARKET_UPDATE_REQUESTED'});
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
  MarketUpdateScene,
);
