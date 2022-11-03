// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';

import {
  View,
  ScrollView,
  Text,
  Dropdown,
} from '../../general/components/coreUIComponents';
import {
  Widget,
  PlaceholderView,
  GlobalFilterPlaceholder,
} from '../../general/components/UIComponents';
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
  selectedProducts: Array<string>;
  categoryList: Array<string>;
  productList: Array<string>;
  chartData: Array<Array<SomTrendComparisonData & {fill?: string}>>;
};

type Props = {
  title: string;
  data: Array<SomTrendComparisonData>;
  selectedTerritory: string;
  selectedBrandFamily: string;
};

export default class CompareBrandSomTrend extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    this.state = {
      selectedCategory: '',
      selectedProducts: [],
      categoryList: [],
      productList: [],
      chartData: [],
    };
    autobind(this);
  }

  componentWillMount() {
    let {data} = this.props;
    if (data.length > 0) {
      let categorySet = new Set();
      data.filter((data) => data.brandFamily).forEach((data) => {
        categorySet.add(data.category.split('_').join(' '));
      });
      this.setState({
        categoryList: Array.from(categorySet.values()),
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let {selectedTerritory, selectedBrandFamily} = nextProps;
    if (
      selectedTerritory !== this.props.selectedTerritory ||
      selectedBrandFamily !== this.props.selectedBrandFamily
    ) {
      this._updateProductList(
        this.state.selectedCategory,
        selectedTerritory,
        selectedBrandFamily,
      );
    }
  }

  _updateProductList(
    selectedCategory: string,
    selectedTerritory: string,
    selectedBrandFamily: string,
  ) {
    let productSet = new Set();
    if (selectedCategory && selectedTerritory) {
      this.props.data
        .filter(
          (data) =>
            data.category.split('_').join(' ') === selectedCategory &&
            data.territory === selectedTerritory &&
            data.brandFamily &&
            (!selectedBrandFamily || selectedBrandFamily === data.brandFamily),
        )
        .forEach((data) => productSet.add(data.product));
    }
    this.setState({
      productList: Array.from(productSet.values()),
      selectedProducts: [],
      chartData: [],
    });
  }

  _updateCategoryList(territory: string) {
    let categorySet = new Set();
    let {selectedBrandFamily} = this.props;
    this.props.data
      .filter(
        (data) =>
          data.brandFamily &&
          (!territory || data.territory === territory) &&
          (!selectedBrandFamily || selectedBrandFamily === data.brandFamily),
      )
      .forEach((data) => categorySet.add(data.category.split('_').join(' ')));
    let {selectedCategory} = this.state;
    if (!categorySet.has(selectedCategory)) {
      selectedCategory = '';
    }
    let categoryList = Array.from(categorySet.values());
    this.setState({categoryList, selectedCategory});
  }

  _onCategorySelected(selectedCategory: string) {
    let {selectedTerritory, selectedBrandFamily} = this.props;
    this.setState({selectedCategory});
    this._updateProductList(
      selectedCategory,
      selectedTerritory,
      selectedBrandFamily,
    );
  }

  _onProductSelected(selectedProducts: Array<string>) {
    this.setState({selectedProducts});
    let {selectedCategory} = this.state;
    let {selectedTerritory, selectedBrandFamily} = this.props;
    let chartMap = new Map();
    const data = this.props.data.filter(
      (data) =>
        data.category.split('_').join(' ') === selectedCategory &&
        data.territory === selectedTerritory &&
        data.brandFamily &&
        (!selectedBrandFamily || selectedBrandFamily === data.brandFamily),
    );
    selectedProducts.forEach((product, index) => {
      let productData = data
        .filter((data) => data.product === product)
        .map((data) => ({
          ...convertObjectValueToNumber(data, ['som', 'somGrowth', 'somPP']),
          fill: LINE_CHART_COLORS[index],
        }))
        .sort((a, b) => Number(a.monthID) - Number(b.monthID));
      chartMap.set(product, productData);
    });
    this.setState({chartData: Array.from(chartMap.values())});
  }

  render() {
    let {
      selectedCategory,
      selectedProducts,
      categoryList,
      productList,
      chartData,
    } = this.state;
    let {selectedTerritory, title} = this.props;
    let mmaData = chartData.map((data) => data[data.length - 1]);
    return (
      <Widget
        title={title}
        filters={
          <View style={[styles.rowFlexed, styles.filterContainer]}>
            <View style={styles.rightPadding}>
              <GlobalFilterPlaceholder
                label="Territory"
                value={selectedTerritory}
              />
            </View>
            <View style={styles.rightPadding}>
              <Dropdown
                label="Category"
                selectedValue={selectedCategory}
                onSelect={this._onCategorySelected}
                options={categoryList}
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
          name="CompareBrandSomTrendState"
          data={this.state}
          onMount={(data) => this.setState(data)}
        />
        <View style={[styles.flex, styles.rowFlexed]}>
          <View style={{flex: 2}}>
            {!selectedTerritory ? (
              <PlaceholderView text="Please select Territory on global filter" />
            ) : !selectedCategory ? (
              <PlaceholderView text="Please select Category" />
            ) : selectedProducts.length === 0 ? (
              <PlaceholderView text="Please select Product" />
            ) : (
              <SomTrendComparisonChart
                key={chartData.length}
                data={chartData}
                tooltip="product"
              />
            )}
          </View>
          <View style={styles.flex}>
            <View style={[styles.flex, styles.leftMargin]}>
              <Vs3MMATable data={mmaData} compare="product" />
            </View>
            <View style={[styles.flex, styles.legendContainer]}>
              <Text fontWeight="bold">Product</Text>
              <ScrollView style={styles.flex}>
                {chartData.map((data, index) => (
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
                      {data[0].product}
                    </Text>
                  </View>
                ))}
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
