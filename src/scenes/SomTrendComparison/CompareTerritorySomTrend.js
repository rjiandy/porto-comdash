// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';

import {
  View,
  ScrollView,
  Text,
  Dropdown,
} from '../../general/components/coreUIComponents';
import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import {Rectangle} from '../../general/components/shapesComponent';
import Persist from '../../general/components/Persist';
import {PALE_GREY, LINE_CHART_COLORS} from '../../general/constants/colors';

import autobind from 'class-autobind';
import convertObjectValueToNumber from '../../general/helpers/convertObjectValueToNumber';
import SomTrendComparisonChart from './charts/SomTrendComparisonChart';
import Vs3MMATable from './charts/Vs3MMATable';

import type {SomTrendComparisonData} from './types/SomTrendComparison-type';

type State = {
  selectedCategory: string;
  selectedProduct: string;
  selectedTerritories: Array<string>;
  categoryList: Array<string>;
  productList: Array<string>;
  territoryList: Array<string>;
  chartData: Array<Array<SomTrendComparisonData & {fill?: string}>>;
};

type Props = {
  title: string;
  data: Array<SomTrendComparisonData>;
};

export default class CompareTerritorySomTrend extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    this.state = {
      selectedCategory: '',
      selectedProduct: '',
      selectedTerritories: [],
      categoryList: [],
      productList: [],
      territoryList: [],
      chartData: [],
    };
    autobind(this);
  }

  componentWillMount() {
    let {data} = this.props;
    if (data.length > 0) {
      this._initializeFilterList(data);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let {data} = nextProps;
    if (data.length > 0 && data.length !== this.props.data.length) {
      this._initializeFilterList(data);
    }
  }

  _initializeFilterList(data: Array<SomTrendComparisonData>) {
    let productSet = new Set();
    let categorySet = new Set();
    data.filter((data) => !data.brandFamily).forEach((data) => {
      productSet.add(data.product);
      categorySet.add(data.category.split('_').join(' '));
    });
    this.setState({
      productList: Array.from(productSet.values()),
      categoryList: Array.from(categorySet.values()),
    });
  }

  _updateTerritoryList(selectedCategory: string, selectedProduct: string) {
    let territorySet = new Set();
    if (selectedCategory && selectedProduct) {
      this.props.data
        .filter(
          (data) =>
            data.category.split('_').join(' ') === selectedCategory &&
            data.product === selectedProduct &&
            !data.brandFamily
        )
        .forEach((data) => territorySet.add(data.territory));
    }
    this.setState({
      territoryList: Array.from(territorySet.values()),
      selectedTerritories: [],
      chartData: [],
    });
  }

  _updateProductList(category: string) {
    let productSet = new Set();
    this.props.data
      .filter(
        (data) =>
          !data.brandFamily &&
          (!category || data.category.split('_').join(' ') === category)
      )
      .forEach((data) => productSet.add(data.product));
    let {selectedProduct} = this.state;
    if (!productSet.has(selectedProduct)) {
      selectedProduct = '';
    }
    let productList = Array.from(productSet.values());
    this.setState({productList, selectedProduct});
  }

  _onCategorySelected(selectedCategory: string) {
    this.setState({selectedCategory});
    this._updateProductList(selectedCategory);
    this._updateTerritoryList(selectedCategory, this.state.selectedProduct);
  }

  _onProductSelected(selectedProduct: string) {
    this.setState({selectedProduct});
    this._updateTerritoryList(this.state.selectedCategory, selectedProduct);
  }

  _onTerritorySelected(selectedTerritories: Array<string>) {
    this.setState({selectedTerritories});
    let {selectedCategory, selectedProduct} = this.state;
    let chartMap = new Map();
    const data = this.props.data.filter(
      (data) =>
        data.category.split('_').join(' ') === selectedCategory &&
        data.product === selectedProduct &&
        !data.brandFamily
    );
    selectedTerritories.forEach((territory, index) => {
      let territoryData = data
        .filter((data) => data.territory === territory)
        .map((data) => ({
          ...convertObjectValueToNumber(data, ['som', 'somGrowth', 'somPP']),
          fill: LINE_CHART_COLORS[index],
        }))
        .sort((a, b) => Number(a.monthID) - Number(b.monthID));
      chartMap.set(territory, territoryData);
    });
    this.setState({chartData: Array.from(chartMap.values())});
  }

  render() {
    let {
      selectedTerritories,
      selectedCategory,
      selectedProduct,
      categoryList,
      productList,
      territoryList,
      chartData,
    } = this.state;
    let {title} = this.props;
    let mmaData = chartData.map((data) => data[data.length - 1]);
    return (
      <Widget
        title={title}
        filters={
          <View style={[styles.rowFlexed, styles.filterContainer]}>
            <View style={styles.rightPadding}>
              <Dropdown
                label="Category"
                selectedValue={selectedCategory}
                onSelect={this._onCategorySelected}
                options={categoryList}
              />
            </View>
            <View style={styles.rightPadding}>
              <Dropdown
                label="Product"
                selectedValue={selectedProduct}
                onSelect={this._onProductSelected}
                options={productList}
              />
            </View>
            <View>
              <Dropdown
                label="Territory"
                selectedValue={selectedTerritories}
                onSelect={this._onTerritorySelected}
                options={territoryList}
                multiple
              />
            </View>
          </View>
        }
      >
        <Persist
          name="CompareTerritorySomTrend"
          data={this.state}
          onMount={(data) => this.setState(data)}
        />
        <View style={[styles.flex, styles.rowFlexed]}>
          <View style={{flex: 2}}>
            {!selectedCategory
              ? <PlaceholderView text="Please select Category" />
              : !selectedProduct
                ? <PlaceholderView text="Please select Product" />
                : selectedTerritories.length === 0
                  ? <PlaceholderView text="Please select Territory" />
                  : <SomTrendComparisonChart
                      key={chartData.length}
                      data={chartData}
                      tooltip="territory"
                    />}
          </View>
          <View style={{flex: 1}}>
            <View style={[styles.flex, styles.leftMargin]}>
              <Vs3MMATable data={mmaData} compare="territory" />
            </View>
            <View style={[styles.flex, styles.legendContainer]}>
              <Text fontWeight="bold">Territory</Text>
              <ScrollView style={styles.flex}>
                {chartData.map((data, index) =>
                  <View
                    key={index}
                    style={[
                      styles.rowFlexed,
                      styles.topMargin,
                      styles.centerAligned,
                    ]}
                  >
                    <Rectangle size={1} backgroundColor={data[0].fill} />
                    <Text customStyle="small" style={styles.leftPadding}>
                      {data[0].territory}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
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
  filterContainer: {
    paddingBottom: 20,
  },
  centerAligned: {
    alignItems: 'center',
  },
  leftMargin: {
    marginLeft: 10,
  },
  leftPadding: {
    paddingLeft: 15,
  },
  rightPadding: {
    paddingRight: 15,
  },
  bottomMargin: {
    marginBottom: 20,
  },
  topMargin: {
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 20,
    marginVertical: 5,
  },
  legendContainer: {
    backgroundColor: PALE_GREY,
    marginLeft: 10,
    marginTop: 20,
    padding: 10,
  },
});
